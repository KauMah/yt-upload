import React from 'react';
import TextTruncate from 'react-text-truncate';

const styles = {
    link: {
        borderRadius: '3px',
        backgroundColor: '#c9c9c9',
        margin: '10px 10px',
        textDecoration: 'none',
        color: '#000',
    },
    container: {
        height: 180,
        width: 320,
        position: 'relative' as 'relative',
    },
    thumbnail: {
        height: 180,
        width: 320,
    },
};

interface Props {
    title: string;
    thumbnailUrl: string;
    id: string;
}

const Tile = ({ title, thumbnailUrl, id }: Props) => {
    return (
        <a href={`/${id}`} style={styles.link}>
            <TextTruncate
                line={1}
                element="h6"
                truncateText="..."
                text={title}
            />
            <div style={styles.container}>
                <img style={styles.thumbnail} src={thumbnailUrl} alt=""></img>
            </div>
        </a>
    );
};

export default Tile;
