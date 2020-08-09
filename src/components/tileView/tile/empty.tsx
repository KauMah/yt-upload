import React from 'react';
import TextTruncate from 'react-text-truncate';

const styles = {
    link: {
        borderRadius: '3px',
        backgroundColor: '#c9c9c9',
        margin: '10px 10px',
        textDecoration: 'none',
        color: '#000',
        cursor: 'pointer',
    },
    container: {
        height: 180,
        width: 320,
        position: 'relative' as 'relative',
    },
    thumbnail: {
        height: 180,
        width: 320,
        backgroundColor: '#000',
    },
};

interface Props {
    loadMore: () => void;
}

const EmptyTile = ({ loadMore }: Props) => {
    return (
        <div
            onClick={() => {
                loadMore();
            }}
            style={styles.link}>
            <TextTruncate
                line={1}
                element="h6"
                truncateText="..."
                text={'Load More'}
            />
            <div style={styles.container}>
                <div style={styles.thumbnail}></div>
            </div>
        </div>
    );
};

export default EmptyTile;
