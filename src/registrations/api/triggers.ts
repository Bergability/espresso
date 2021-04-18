import espresso from '../../core/espresso';
import { TriggerSchema } from '@typings/espresso';

/**
 *
 * Triggers
 *
 */
espresso.server.register({
    path: '/api/triggers',
    method: 'get',
    response: (req, res) => {
        const slugs = req.query.slugs;
        let payload: TriggerSchema[];

        if (slugs) {
            const parsedSlugs = JSON.parse(slugs as string) as string[];
            payload = espresso.triggers.filter((t) => parsedSlugs.includes(t.slug));
        } else {
            payload = espresso.triggers.getAll().reduce<TriggerSchema[]>((acc, trigger) => {
                return [...acc, trigger];
            }, []);
        }

        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
    },
});
