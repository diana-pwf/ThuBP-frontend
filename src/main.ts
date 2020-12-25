import Vue from 'vue'
// -ignore
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import store from './store'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueApollo from 'vue-apollo'
import {HttpLink} from 'apollo-boost';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Antd)
Vue.use(VueApollo)
Vue.config.productionTip = false

import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import axios from "axios";
import {ApolloLink} from "apollo-link";

// HTTP connection to the API
// const httpLink = createHttpLink({
//   // You should use an absolute URL here
//   uri: 'http://211.159.159.210:9960/api/v1/graphql',
//     headers: {
//         Authorization: window.localStorage.getItem('jwt')
//     }
// })

const httpLink = new HttpLink({uri: 'https://thubp.iterator-traits.com/api/v1/graphql'});

const authLink = new ApolloLink((operation, forward) => {
    // Retrieve the authorization token from local storage.
    const token = localStorage.getItem('jwt');

    // Use the setContext method to set the HTTP headers.
    operation.setContext({
        headers: {
            Authorization: token
        }
    });

    // Call the next link in the middleware chain.
    return forward(operation);
});

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink), // Chain it with the HttpLink
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: "no-cache",
            errorPolicy: "all"
        }
    }
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
})

new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
}).$mount('#app')
