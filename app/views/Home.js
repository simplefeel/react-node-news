import React, { Component } from 'react'
import { List, Avatar, Button, Spin } from 'antd'
import axios from 'axios'
import './home.css'

class Home extends Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            loading: true,
            loadingMore: false,
            showLoadingMore: true,
            data: [],
            pageSize: 2
        }
    }
    
    componentWillMount (){
        axios
        .get('/news')
        .then((res)=> {
            this.setState({
                loading: false,
                data: res.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    onLoadMore = () => {
        let {pageSize} = this.state;
        pageSize++;
        this.setState({
            loadingMore: true,
        });
        this.getData((res) => {
            const data = this.state.data.concat(res);
            this.setState({
                data,
                loadingMore: false,
                pageSize
            });
        });
    }

    getData = (callback) => {
        const {pageSize} = this.state;
        axios
        .get(`/news/${pageSize}`)
        .then((res)=> {
            callback(res.data)
        })
        .catch(function (error) {
            console.log(error);
        });
      }

    render () {
        const { loading, loadingMore, showLoadingMore, data } = this.state;
        const loadMore = showLoadingMore ? (
        <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            {loadingMore && <Spin />}
            {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
        </div>
        ) : null;
        return (
            <List
                className="demo-loadmore-list"
                loading={loading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={data}
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.time}
                    />
                </List.Item>
                )}
            />
        )
    }
}

export default Home