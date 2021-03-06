// Base Class
import EspressoRegistrar from './registrar';

// Types
import { ActionSchema } from '@typings/espresso';
import { Object, Input } from '@typings/inputs';
import { generateDefaults } from '../utilities';

export default class EspressoActions extends EspressoRegistrar<ActionSchema> {
    constructor() {
        super({
            registeredEvent: 'action-registered',
        });
    }

    protected preRegister = (trigger: ActionSchema) => {
        // If an action with this slug already exsists don't register it
        return this.find((t) => t.slug === trigger.slug) ? false : true;
    };

    public generateDefaults(slug: string): Object {
        const schema = this.find((a) => a.slug === slug);
        if (schema && schema.settings) return generateDefaults(schema.settings);
        return {};
    }
}
