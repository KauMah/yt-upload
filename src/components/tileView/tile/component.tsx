import { Link } from 'react-router-dom';
import React from 'react';
import TextTruncate from 'react-text-truncate';

const styles = {
    link: {
        borderRadius: '3px',
        backgroundColor: '#c9c9c9',
        margin: '10px 10px',
        textDecoration: 'none',
        color: '#000',
        maxWidth: 320,
    },
    container: {
        height: 180,
        width: 320,
        maxWidth: 320,
        position: 'relative' as 'relative',
    },
    thumbnail: {
        height: 180,
        width: 320,
        maxWidth: 320,
    },
    text: {
        padding: '5px 0 0 5px',
    },
};

interface Props {
    title: string;
    thumbnailUrl: string;
    id: string;
}

const Tile = ({ title, thumbnailUrl, id }: Props) => {
    return (
        <Link to={`/videos/${id}`} style={styles.link}>
            <div style={styles.text}>
                <TextTruncate
                    line={1}
                    element="h6"
                    truncateText="..."
                    text={title}
                />
            </div>
            <div style={styles.container}>
                <img style={styles.thumbnail} src={thumbnailUrl} alt=""></img>
            </div>
        </Link>
    );
};

export default Tile;
