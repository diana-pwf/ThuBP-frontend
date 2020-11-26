import gql from 'graphql-tag';

export const findMatchesByOrganizerId = gql`query findMatchesByOrganizerId($userIds: [String!]!){
    findUserById(userIds: $userIds) {
        organizedMatches {
            name
            description
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
