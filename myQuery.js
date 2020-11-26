import gql from 'graphql-tag';

export const qwq = gql`query {
    findMatches(matchIds: ["1"]) {
       matchId
       matchTypeId
       organizerUser {
          username
       }
    }
}`;


export const getMatchesList = gql`query  getMatchesList($typeIds:[String!]){
    findMatchesByType(typeIds:$typeIds){
    matchId
    matchTypeId
    name
    description
    }
    }`;
