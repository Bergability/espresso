// Base Class
import EspressoRegistrar from './registrar';

// Types
import { EspressoTrigger } from '@typings/espresso';

export default class EspressoTriggers extends EspressoRegistrar<EspressoTrigger> {
    constructor() {
        super({
            registeredEvent: 'trigger-registered',
        });
    }

    protected preRegister = (trigger: EspressoTrigger) => {
        // If a trigger with this slug already exsists don't register it
        return this.find((t) => t.slug === trigger.slug) ? false : true;
    };

    public trigger(slug: string) {
        const trigger = this.find((t) => t.slug === slug);

        if (!trigger) return;

        // TODO run triggers
    }
}
