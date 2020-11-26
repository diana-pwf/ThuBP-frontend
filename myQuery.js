import gql from 'graphql-tag';

export const qwq = gql`query {
    findMatches(matchIds: ["3"]) {
       matchId
       matchTypeId
       organizerUser {
          username
       }
    }
}`;