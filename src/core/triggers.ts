// Base Class
import EspressoRegistrar from './registrar';

// Types
import { Object } from '@typings/inputs';
import { Action, TriggerSchema } from '@typings/espresso';
import espresso from './espresso';
import { ActionSet, Item } from '@typings/items';

export default class EspressoTriggers extends EspressoRegistrar<TriggerSchema> {
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

        const ranSets: string[] = [];

        const actionSets: ActionSet[] = (espresso.store.get('items') as Item[]).filter((item) => {
            if (item.type !== 'action-set') return false;
            if (item.active === false) return false;
            if (exclude.includes(item.id)) return false;
            return item.triggers.includes(slug);
        }) as ActionSet[];

        actionSets.forEach((actionSet) => {
            console.log(`Running action set ${actionSet.id}`);
            if (trigger.predicate) {
                const shouldRun = trigger.predicate(
                    triggerData,
                    actionSet.settings.find((s) => s.for === slug)
                );
                if (shouldRun === false) return;
            }

            // TODO should we be passing in trigger data?
            this.runActions(actionSet.actions, trigger.settings, triggerData);
            ranSets.push(actionSet.id);
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
}
