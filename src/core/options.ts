// Base Class
import EspressoRegistrar from './registrar';

// Types
import { EspressoOptions } from '@typings/espresso';

export default class EspressoOptionsManager extends EspressoRegistrar<EspressoOptions> {
    constructor() {
        super({
            registeredEvent: 'option-registered',
        });
    }

    protected preRegister = (option: EspressoOptions) => {
        // If a trigger with this slug already exsists don't register it
        return this.find((o) => o.slug === option.slug) ? false : true;
    };
}
