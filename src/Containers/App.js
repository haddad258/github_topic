import React, { Component } from 'react'
import RepoList from '../Components/RepoList'
import Loading from '../Components/Loading'
import axios from 'axios'
import moment from 'moment'

class App extends Component {
  constructor () {
    super()
    this.state = {
      repo: [],
      error: '',
      page: 1,
      loading: true

    }
  }

  componentDidMount () {
    this.loadRepo() 
    window.addEventListener('scroll', this.handleLoadMore)
  }

    loadRepo = () => {
      const { page, repo } = this.state
// Formatted as a JSON date, and split it to make it look like this "YYYY-MM-DD"
// return -30 from now as YYYY-MM-DD
      const DATE_30_DAYS_BEFORE = moment().subtract(30, 'days').format('YYYY-MM-DD')

         // The url that we gonna fetch from.
         //using axios

      axios.get(
        ` https://api.github.com/search/repositories?q=created:>${DATE_30_DAYS_BEFORE}&sort=stars&order=desc&page=${page} `
      )

        .then(resp => {
        
      // extract the data the we need, "The response contains a lot of an useless data on our case".

          this.setState({
            
            repo: [...repo, ...resp.data.items], 
            loading: false

          })

          
        })

        .catch((error) => {
          // What the previous value of page and add 1 to it
          this.setState({
            error: error,
            loding: false
          })
        })
    }

    handleLoadMore = () => {
      const { loading } = this.state
        // We are about to fetch so we have to set loading to true.
        if (window.pageYOffset + window.innerHeight >= window.innerHeight && !loading) {
        this.loadData()
      }
    }

    loadData = () => {
      const { page } = this.state
      this.setState((prevState) => ({
        page: prevState.page + page,
        loading: true
      }))
      this.loadRepo()
    }

    render () {
      const { repo } = this.state

      return (
        <div>
          <RepoList repo={repo} />
          <Loading />
        </div>
      )
    }
}

export default App
