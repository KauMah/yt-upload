import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const styles = {};

interface Props extends RouteComponentProps<{ id: string }> {}
const EditVideo: React.FC<Props> = ({ match }) => {
    return <div>returns video with id {match.params.id}</div>;
};

export default EditVideo;
