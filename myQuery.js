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

export const getMatchesList = gql`query getMatchesList($typeIds:[String!]){
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

export const getParticipants = gql`query getParticipants($matchId: String!){
    findMatchById(matchId: $matchId) {
        participants {
            userId
            username
        }
    }
}`;

export const findMatchDetailById = gql`query findMatchDetailById($matchId: String!){
    findMatchById(matchId: $matchId) {
        matchTypeId
        organizerUser {
            userId
            username
        }
        name
        description
        targetGroup
        units {
            unitId
            name
            creator {
                username   
            }
            members {
                userId
            }
        }
        minUnitMember
        maxUnitMember
    }
}`;

export const findUserByName = gql`query findUserByName($username: String!){
    findUserByFuzzy(username:$username){
        username
        userId
        createdAt
    }
}`;

export const getUnitDetail = gql`query getUnitDetail($unitId: String!){
    findUnitById(unitId:$unitId){
        name
        creator {
            userId
            username
        }
        members {
            userId
            username
        }
    }
}`;