// Libraries
import React from 'react';

// Components
import { Typography } from '@material-ui/core';
import ItemDisplay from './item-display';

// Types
import { Item } from '@typings/items';

interface Props {
    type: Item['type'];
    items: Item[];
}

const ItemDisplayBlock: React.FC<Props> = ({ type, items }) => {
    let title: string;

    switch (type) {
        case 'action-set':
            title = 'Action Set';
            break;
        case 'folder':
            title = 'Folders';
            break;

        case 'list':
            title = 'Lists';
            break;
    }

    const filtered = items.filter((i) => i.type === type);

    if (filtered.length === 0) return null;

    const sorted = filtered.sort((a, b) => {
        if (a.name === b.name) return 0;
        if (a.name > b.name) return 1;

        return -1;
    });

    return (
        <div className="espresso-item-display-block">
            <Typography variant="caption" style={{ opacity: 0.5 }}>
                {title}
            </Typography>
            <div className="espresso-item-display-list">
                {sorted.map((item) => (
                    <ItemDisplay key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default ItemDisplayBlock;
