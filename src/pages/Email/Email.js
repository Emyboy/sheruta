import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications';
import EmailSender from '../../components/EmailSender/EmailSender'
import Cookies from 'js-cookie'

const Email = (props) => {
    const { addToast } = useToasts();
    const [state, setState] = useState({
        loading: false
    });

    const [data, setData] = useState({
        body: null,
        heading: null,
        actionText: null,
        actionURL: null
    });

    useEffect(() => {
        console.log(data)
    });

    const handleSubmit = e => {
        e.preventDefault();
        setState({ ...state, loading: true });
        axios(process.env.REACT_APP_API_URL + '/sheruta/send/email', {
            method: 'POST',
            data,
            headers: {
                Authorization:
                    `Bearer ${Cookies.get('token')}`,
            },
        })
            .then(res => {
                setState({ ...state, loading: false });
                console.log(res);
                addToast('Email has been sent', { appearance: 'success', autoDismiss: true });
                setData({ ...data, actionText: '', actionURL: '', body: '', heading: '' })
                alert('Added')
            })
            .catch(err => {
                setState({ ...state, loading: false });
                console.log(err)
            })
    }

    return (
        <Layout
            pageName='email'
        >
            <EmailSender />
        </Layout>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Email)
