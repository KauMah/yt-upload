import { AppState, TokenObj } from '../../reduxStore';
import { EmptyTile, Tile } from './tile/';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';

const styles = {
    container: {
        padding: '20px 30px',
    },
};

interface Props {
    token: TokenObj;
}

const TileView = ({ token }: Props) => {
    const [loaded, setLoaded] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [playlistId, setPlaylistId] = useState('');
    const [nextPageToken, setNextPageToken] = useState('');
    const [videoCount, setVideoCount] = useState(0);
    const [videoList, setVideoList] = useState([]);

    useEffect(() => {
        if (!loaded && token.expires_at > Date.now()) {
            axios({
                method: 'get',
                url:
                    'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
                responseType: 'json',
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            }).then((response: any) => {
                setPlaylistId(
                    response.data.items[0].contentDetails.relatedPlaylists
                        .uploads
                );
                axios({
                    method: 'get',
                    url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=19&playlistId=${playlistId}`,
                    responseType: 'json',
                    headers: {
                        Authorization: `Bearer ${token.access_token}`,
                    },
                }).then((response: any) => {
                    setLoaded(true);
                    setNextPageToken(response.data.nextPageToken);
                    setVideoCount(response.data.pageInfo.totalResults);
                    setVideoList(videoList.concat(response.data.items));
                });
            });
        } else if (loadMore && videoList.length < videoCount) {
            axios({
                method: 'get',
                url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=19&pageToken=${nextPageToken}&playlistId=${playlistId}`,
                responseType: 'json',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response: any) => {
                setVideoList(videoList.concat(response.data.items));
            });
        }
    });
    return (
        <div style={styles.container}>
            <div className="row">
                {videoList.map((video: any) => {
                    const title = video.snippet.title;
                    const thumbnailUrl = video.snippet.thumbnails.high.url;
                    const id = video.id;
                    return (
                        <Tile
                            title={title}
                            thumbnailUrl={thumbnailUrl}
                            id={id}
                        />
                    );
                })}
                <EmptyTile loadMore={() => setLoadMore(true)} />
            </div>
        </div>
    );
};

function mapStateToProps(state: AppState) {
    const { accessToken } = state;
    return { token: accessToken };
}

export default connect(mapStateToProps)(TileView);
