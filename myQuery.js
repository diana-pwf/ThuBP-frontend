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
            matchId
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


export const getMatchRelatedTeams = gql`query  getMatchRelatedTeams($matchId: String!){
 findMatchById(matchId: $matchId) {
 units {
            unitId
            name
            creator {
                username   
            }
        }
 }
}
`


export const findMatchDetailById = gql`query findMatchDetailById($matchId: String!){
    findMatchById(matchId: $matchId) {
        matchId
        matchTypeId
        organizerUser {
            userId
            username
        }
        name
        startTime
        description
        targetGroup
        previewLarge
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
        referees {
            username
        }
        minUnitMember
        maxUnitMember
        rounds {
            roundId
            name
            description
            games
            {
                gameId
                status
                startTime
                location
               
            }
            
        }
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
        unitId
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



export const getRoundStrategyTypes = gql`query getRoundStrategyTypes {
    listRoundGameStrategyTypes{
    strategyId
    strategyName
    }
  }`;

export const getGameComments = gql`query getGameComments($gameId: String!) {
    findGameById(gameId:$gameId){
        comments{
            commentId
            issuer {
                userId
                username
            }
            content
            reply {
                issuer {
                    username
                }
            }
        }
    }
  }`;

export const getRoundInfo = gql `query getRoundInfo($roundId:String!){
    findRoundById(roundId: $roundId){
    roundId
    name
    description
    units{
        unitId
        name
        creator{
            username
        }
    }
    games{
        unit0{
            unitId
            name
            creator{
                username
            }
        }
        unit1{
            unitId
            name
            creator{
                username
            }
        }
        startTime
        location
    }
    }
}
`

export const getGameInfo = gql`query getGameInfo($gameId: String!) {
    findGameById(gameId:$gameId){
        comments{
            issuer {
                userId
                username
            }
            content
        }
    }
  }`;


