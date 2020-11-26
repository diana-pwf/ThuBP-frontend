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