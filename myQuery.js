import gql from 'graphql-tag';

export const findMatchesByOrganizerId = gql`query findMatchesByOrganizerId($userIds: [String!]!){
    findUserById(userIds: $userIds) {
        organizedMatches {
            name
            description
            matchId
        }
    }
}`;



export const findMatchesByParticipantId = gql`query findMatchesByParticipantId($userIds: [String!]!){
    findUserById(userIds: $userIds) {
        participatedMatches {
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
    organizerUser
        {
        username
        userId
        }
    }
}`;

export const findOrganizerById = gql`query  findOrganizerById($userIds: [String!]!){
    findUserById(userIds: $userIds) {
        username
    }
}`;
