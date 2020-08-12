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
    text: {
        padding: '5px 0 0 5px',
    },
};

interface Props {
    action: () => void;
    text: string;
}

const EmptyTile = ({ action, text }: Props) => {
    return (
        <div
            onClick={() => {
                action();
            }}
            style={styles.link}>
            <div style={styles.text}>
                <TextTruncate
                    line={1}
                    element="h6"
                    truncateText="..."
                    text={text}
                />
            </div>
            <div style={styles.container}>
                <div style={styles.thumbnail}></div>
            </div>
        </div>
    );
};

export default EmptyTile;
