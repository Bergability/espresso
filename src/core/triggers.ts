// Base Class
import EspressoRegistrar from './registrar';

// Types
import { Object } from '@typings/inputs';
import { Action, TriggerSchema } from '@typings/espresso';
import espresso from './espresso';
import { ActionSet, Item } from '@typings/items';

interface Cooldown {
    id: string;
    start: number;
    timeout: NodeJS.Timeout;
}

export default class EspressoTriggers extends EspressoRegistrar<TriggerSchema> {
    public cooldowns: Cooldown[] = [];

    constructor() {
        super({
            registeredEvent: 'trigger-registered',
        });
    }

    protected preRegister = (trigger: TriggerSchema) => {
        // If a trigger with this slug already exsists don't register it
        return this.find((t) => t.slug === trigger.slug) ? false : true;
    };

    public trigger(slug: string, triggerData: Object = {}, exclude: string[] = []): string[] {
        const trigger = this.find((t) => t.slug === slug);

        if (!trigger) return [];

        espresso.events.dispatchTrigger(slug, triggerData);

        const ranSets: string[] = [];

        const actionSets: ActionSet[] = (espresso.store.get('items') as Item[]).filter((item) => {
            if (item.type !== 'action-set') return false;
            if (item.active === false) return false;
            if (exclude.includes(item.id)) return false;
            return item.triggers.includes(slug);
        }) as ActionSet[];

        actionSets.forEach((actionSet) => {
            // If a cooldown is currently active do not run the set
            if (actionSet.useCooldown && this.cooldowns.find((c) => c.id === actionSet.id)) return;

            if (trigger.predicate) {
                const shouldRun = trigger.predicate(
                    triggerData,
                    actionSet.settings.find((s) => s.for === slug)
                );
                if (shouldRun === false) return;
            }

            if (trigger.getVariables) {
                triggerData = trigger.getVariables(
                    triggerData,
                    actionSet.settings.find((s) => s.for === slug)
                );
            }

            // TODO should we be passing in trigger data?
            this.runActions(actionSet.actions, trigger.settings, triggerData);
            ranSets.push(actionSet.id);

            // Set the cooldown if needed
            if (actionSet.useCooldown) {
                let unit: number;

                switch (actionSet.cooldownUnit) {
                    case 'seconds':
                        unit = 1000;
                        break;

                    case 'minutes':
                        unit = 60000;
                        break;

                    case 'hours':
                        unit = 3600000;
                        break;
                }

                this.setCooldown(actionSet.id, unit * actionSet.cooldown);
            }
        });

        return ranSets;
    }

    private runAction(action: Action, triggerSettings: Object = {}, triggerData: Object) {
        return new Promise<void>((resovle, reject) => {
            const actionSchemas = espresso.actions.getAll();
            const scheam = actionSchemas.find((s) => s.slug === action.slug);

            if (scheam) {
                scheam
                    .run(triggerSettings, action.settings, triggerData, action.actions)
                    .then(() => {
                        resovle();
                    })
                    .catch((e) => {
                        reject(e);
                    });
            }
        });
    }

    public async runActions(actionIds: string[], triggerSettings: Object = {}, triggerData: Object) {
        const actions = espresso.store.get('actions') as Action[];

        for (const actionId of actionIds) {
            const action = actions.find((a) => a.id === actionId);

            if (action) {
                try {
                    await this.runAction(action, triggerSettings, triggerData);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    public setCooldown(id: string, duration: number) {
        // @ts-ignore
        this.cooldowns = [
            // @ts-ignore
            ...this.cooldowns,
            {
                // @ts-ignore
                id,
                // @ts-ignore
                start: Date.now(),
                // @ts-ignore
                timeout: setTimeout(() => {
                    this.removeCooldown(id);
                }, duration),
            },
        ];
    }

    public removeCooldown(id: string) {
        this.cooldowns = this.cooldowns.filter((c) => c.id !== id);
    }
}
