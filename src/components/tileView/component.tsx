import { AppState, LOGOUT, TokenObj } from '../../reduxStore';
import { EmptyTile, Tile } from './tile/';
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import _ from 'lodash';
import axios from 'axios';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const styles = {
    container: {
        padding: '20px 30px',
    },
};

interface Props {
    token: TokenObj;
    signedIn: boolean;
}

const TileView = ({ token, signedIn }: Props) => {
    const [loaded, setLoaded] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [playlistId, setPlaylistId] = useState('');
    const [nextPageToken, setNextPageToken] = useState('');
    const [videoCount, setVideoCount] = useState(0);
    const [videoList, setVideoList] = useState([]);

    const history = useHistory();

    const newVideo = () => {
        history.push('/videos/create');
    };

    const dispatch = useDispatch();
    if (token.expires_at - 1000 <= Date.now()) {
        dispatch({ type: LOGOUT });
    }

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
            }).then(
                (response: any) => {
                    const id =
                        response.data.items[0].contentDetails.relatedPlaylists
                            .uploads;
                    axios({
                        method: 'get',
                        url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${id}`,
                        responseType: 'json',
                        headers: {
                            Authorization: `Bearer ${token.access_token}`,
                        },
                    }).then(
                        (response: any) => {
                            setLoaded(true);
                            setPlaylistId(id);
                            setNextPageToken(response.data.nextPageToken);
                            setVideoCount(response.data.pageInfo.totalResults);
                            setVideoList(
                                _.union(videoList, response.data.items)
                            );
                        },
                        () =>
                            toast.error(
                                'Failed to fetch videos! Refresh the page and try again'
                            )
                    );
                },
                () => toast.error('API Error! Refresh the page and try again')
            );
        } else if (loadMore && videoList.length < videoCount) {
            axios({
                method: 'get',
                url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&pageToken=${nextPageToken}&playlistId=${playlistId}`,
                responseType: 'json',
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            }).then(
                (response: any) => {
                    setVideoList(videoList.concat(response.data.items));
                    setLoadMore(false);
                },
                () =>
                    toast.error(
                        'Failed to fetch more videos! Refresh the page and try again'
                    )
            );
        }
    });
    return signedIn ? (
        <div style={styles.container}>
            <div className="row">
                <EmptyTile action={newVideo} text="Upload video" />
                {videoList.map((video: any) => {
                    const title = video.snippet.title;
                    const thumbnailUrl = video.snippet.thumbnails.high.url;
                    const id = video.snippet.resourceId.videoId;
                    return (
                        <Tile
                            title={title}
                            thumbnailUrl={thumbnailUrl}
                            id={id}
                            key={uuidv4()}
                        />
                    );
                })}
                {videoList.length < videoCount && (
                    <EmptyTile
                        action={() => {
                            if (!loadMore) setLoadMore(true);
                        }}
                        text="Load more..."
                    />
                )}
            </div>
        </div>
    ) : (
        <Redirect to="/login" />
    );
};

function mapStateToProps(state: AppState) {
    const { accessToken, signedIn } = state;
    return { token: accessToken, signedIn: signedIn };
}

export default connect(mapStateToProps)(TileView);
