import { AppState, TokenObj } from '../../reduxStore';
import { Button, TextField } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import { useEffect } from 'react';

const styles = {
    container: {
        margin: '10px 20px',
    },
    formElement: {
        display: 'block',
    },
};

interface Props extends RouteComponentProps<{ id: string }> {
    create: boolean;
    token: TokenObj;
}

interface Category {
    name: string;
    value: number;
}

interface VideoUpload {
    title: string;
    description: string;
    video?: File;
}

const videoTemplate: VideoUpload = {
    title: '',
    description: '',
};

const EditVideo: React.FC<Props> = ({ match, create, token }) => {
    const [categories, setCategories] = useState<Array<Category>>();
    const [loaded, setLoaded] = useState(false);

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
                setCategories(categories);
                setLoaded(true);
            });
        } else {
            console.log(categories);
        }
    });
    return (
        <div style={styles.container} className="container">
            <Formik
                initialValues={videoTemplate}
                onSubmit={(data, { setSubmitting }) => {
                    setSubmitting(true);
                    console.log(data);
                    //make api call
                    setSubmitting(false);
                }}>
                {({
                    values,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setValues,
                }) => (
                    <Form>
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
                        <Field />
                        <input
                            name="video"
                            type="file"
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    video: _.get(e, 'target.files[0]', null),
                                })
                            }
                        />
                        <Button disabled={isSubmitting} type={'submit'}>
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const mapStateToProps = (state: AppState) => {
    const { accessToken } = state;
    return { token: accessToken };
};

export default connect(mapStateToProps)(EditVideo);
