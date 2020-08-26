import { AppState, LOGOUT, TokenObj } from '../../reduxStore';
import {
    Button,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import _ from 'lodash';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const styles = {
    container: {
        margin: '10px 20px',
    },
    form: {
        width: '200px',
        maxWidth: '200px',
    },
    formElement: {
        display: 'block',
        padding: '5px',
    },
};

interface Props extends RouteComponentProps<{ id: string }> {
    token: TokenObj;
    signedIn: boolean;
}

interface Category {
    name: string;
    value: number;
}

interface VideoUpload {
    title: string;
    description: string;
    category: number | string;
    privacyStatus: string;
    video?: File;
}

const videoTemplate: VideoUpload = {
    title: '',
    description: '',
    category: '',
    privacyStatus: 'public',
    video: undefined,
};

const EditVideo: React.FC<Props> = ({ match, token, signedIn }) => {
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [loaded, setLoaded] = useState(false);
    const [formLoaded, setFormLoaded] = useState(false);
    const [leavePage, setLeavePage] = useState(false);
    const isCreate = match.path === '/videos/create';

    const dispatch = useDispatch();
    if (token.expires_at - 1000 <= Date.now()) {
        dispatch({ type: LOGOUT });
    }

    const fetchVideoData = async (): Promise<VideoUpload> => {
        let result;
        try {
            result = await axios({
                method: 'GET',
                headers: {
                    authorization: `Bearer ${token.access_token}`,
                    accept: 'application/json',
                },
                url: `https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatus&id=${match.params.id}`,
            });
        } catch (e) {
            console.error(e);
        }
        return {
            title: _.get(result, 'data.items[0].snippet.title', ''),
            description: _.get(result, 'data.items[0].snippet.description', ''),
            category: _.get(result, 'data.items[0].snippet.categoryId', 1),
            privacyStatus: _.get(
                result,
                'data.items[0].status.privacyStatus',
                ''
            ),
        };
    };

    const uploadVideo = async (video: VideoUpload) => {
        if (!video.video) {
            return;
        }
        await axios({
            method: 'POST',
            headers: {
                authorization: `Bearer ${token.access_token}`,
                accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Upload-Content-Length': video.video.size,
                'x-upload-content-type': video.video.type,
            },
            url:
                'https://www.googleapis.com/upload/youtube/v3/videos?part=snippet%2Cstatus&uploadType=resumable',
            data: {
                snippet: {
                    title: video.title,
                    description: video.description,
                    categoryId: video.category,
                },
                status: {
                    privacyStatus: video.privacyStatus,
                },
            },
        }).then(
            async (res) => {
                const url = res.headers['location'];
                await axios({
                    method: 'PUT',
                    url: url,
                    headers: {
                        authorization: `Bearer ${token.access_token}`,
                        'Content-Type': video.video?.type,
                    },
                    data: await video.video?.arrayBuffer(),
                }).then(
                    () => {
                        setLeavePage(true);
                        toast.success('Upload Successful');
                    },
                    () => {
                        toast.error('Upload Failed');
                    }
                );
            },
            (err) => {
                console.log(err.toJSON());
                toast.error('Upload Failed');
            }
        );
    };

    const updateVideo = async (video: VideoUpload) => {
        await axios({
            method: 'PUT',
            headers: {
                authorization: `Bearer ${token.access_token}`,
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            url: `https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatus&id=${match.params.id}`,
            data: {
                id: match.params.id,
                snippet: {
                    title: video.title,
                    description: video.description,
                    categoryId: video.category,
                },
                status: {
                    privacyStatus: video.privacyStatus,
                },
            },
        }).then(
            (response) => {
                toast.success(
                    `Successfully updated video: ${response.data.snippet.title}`
                );
                setLeavePage(true);
            },
            () => {
                toast.error('Failed to update video!');
            }
        );
    };

    const deleteVideo = async () => {
        await axios({
            method: 'DELETE',
            url: `https://www.googleapis.com/youtube/v3/videos?id=${match.params.id}`,
            headers: {
                authorization: `Bearer ${token.access_token}`,
                accept: 'application/json',
            },
        }).then(
            () => {
                setLeavePage(true);
                toast.success('Successfully deleted video!');
            },
            () => {
                toast.error('Failed to delete video!');
            }
        );
    };

    useEffect(() => {
        const fetchCategories = async () => {
            let result;
            try {
                result = await axios({
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token.access_token}`,
                        accept: 'application/json',
                    },
                    url:
                        'https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US',
                });
            } catch (e) {
                console.log(e);
            }
            const validCategories = _.filter(
                _.get(result, 'data.items', []),
                (item) => _.get(item, 'snippet.assignable', false)
            );
            return _.map(validCategories, (item) => {
                return {
                    name: item.snippet.title,
                    value: item.id,
                } as Category;
            });
        };

        if (!loaded) {
            fetchCategories().then((categories: Array<Category>) => {
                setLoaded(true);
                setCategories(categories);
            });
        }
    });

    return signedIn && !leavePage ? (
        <div style={styles.container} className="container">
            {!isCreate && (
                <Button type="button" onClick={deleteVideo}>
                    Delete
                </Button>
            )}
            <Formik
                initialValues={videoTemplate}
                onSubmit={(data, { setSubmitting }) => {
                    setSubmitting(true);
                    isCreate
                        ? uploadVideo(data).then(
                              () => setSubmitting(false),
                              () => setSubmitting(false)
                          )
                        : updateVideo(data).then(
                              () => setSubmitting(false),
                              () => setSubmitting(false)
                          );
                    setSubmitting(false);
                }}>
                {({
                    values,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setValues,
                }) => {
                    if (loaded && !formLoaded) {
                        fetchVideoData().then((vid) => {
                            setFormLoaded(true);
                            setValues({ ...vid, video: values.video });
                        });
                    }
                    return (
                        <Form style={styles.form}>
                            <Field
                                placeholder="Enter a title..."
                                name="title"
                                type="input"
                                as={TextField}
                                style={styles.formElement}
                            />
                            <Field
                                placeholder="Enter a description..."
                                name="description"
                                type="input"
                                as={TextField}
                                style={styles.formElement}
                            />
                            <InputLabel
                                style={styles.formElement}
                                id="category-label">
                                Category
                            </InputLabel>
                            <Field
                                name="category"
                                id="category"
                                labelId="category-label"
                                as={Select}
                                style={{
                                    ...styles.formElement,
                                    marginLeft: '5px',
                                    padding: '0',
                                }}>
                                {categories.map((category, index) => (
                                    <MenuItem
                                        value={category.value}
                                        key={index}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Field>
                            <Field
                                name="privacyStatus"
                                id="privacyStatus"
                                labelId="privacyStatus-label"
                                as={Select}
                                style={{
                                    ...styles.formElement,
                                    marginLeft: '5px',
                                    padding: '0',
                                }}>
                                <MenuItem value={'public'} key={'public'}>
                                    Public
                                </MenuItem>
                                <MenuItem value={'private'} key={'private'}>
                                    Private
                                </MenuItem>
                                <MenuItem value={'unlisted'} key={'unlisted'}>
                                    Unlisted
                                </MenuItem>
                            </Field>
                            {isCreate && (
                                <input
                                    name="video"
                                    type="file"
                                    style={styles.formElement}
                                    onChange={(e) =>
                                        setValues({
                                            ...values,
                                            video: _.get(
                                                e,
                                                'target.files[0]',
                                                null
                                            ),
                                        })
                                    }
                                />
                            )}
                            <Button disabled={isSubmitting} type={'submit'}>
                                Submit
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    ) : (
        <Redirect to={leavePage ? '/videos' : '/login'} />
    );
};

const mapStateToProps = (state: AppState) => {
    const { accessToken, signedIn } = state;
    return { token: accessToken, signedIn: signedIn };
};

export default connect(mapStateToProps)(EditVideo);
