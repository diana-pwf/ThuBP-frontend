import gql from 'graphql-tag';

export const findMatchesByOrganizerId = gql`query findMatchesByOrganizerId($userIds: [String!]!){
    findUserById(userIds: $userIds) {
        organizedMatches {
            name
            description
            matchId
            previewLarge
        }
    }
}`;

export const findMatchesByParticipantId = gql`query findMatchesByParticipantId($userIds: [String!]!){
    findUserById(userIds: $userIds) {
        participatedMatches {
            name
            description
            matchId
            previewLarge
        }
    }
}`;

export const getMatchesList = gql`query getMatchesList($typeIds:[String!],$page:Int = 0 ,$pageSize:Int = 10){
    findMatchesByType(typeIds:$typeIds,page:$page,pageSize:$pageSize){
    page
    pageSize
    totalSize
    list
         {
             matchId
            matchTypeId
            name
            description
            previewLarge
            organizerUser
            {
                username
                userId
            }
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


export const getMatchRelatedUsers = gql`query  getMatchRelatedUsers($matchId: String!){
 findMatchById(matchId: $matchId) {
     units {
                unitId
                name
                creator {
                    username   
                }
            }
     referees{
                userId
                username
     }
     }
}
`


export const findMatchDetailById = gql`query findMatchDetailById($matchId: String!){
    findMatchById(matchId: $matchId) {
        publicShowUp
        publicSignUp
        matchId
        matchTypeId
        organizerUser {
            userId
            username
        }
        name
        status
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
                unit0{
                name
                }
                unit1{
                name
                }
                referee
                {
                    userId
                    username
                }
            }
            
        }
    }
}`;

export const findUserByName = gql`query findUserByName($username: String!){
    findUserByFuzzy(username:$username){
        page
        pageSize
        totalSize
        list
        {
            username
            userId
            createdAt
        }
    }
}`;

export const getUnitDetail = gql`query getUnitDetail($unitId: String!){
    findUnitById(unitId:$unitId){
        unitId
        name
        description
        creator {
            userId
            username
            description
            avatar
        }
        members {
            userId
            username
            description
            avatar
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
        referee
            {
            userId
            username
        }
        startTime
        location
    }
    }
}
`

export const getGameScoreAndRecord = gql`query getGameInfo($gameId: String!) {
    findGameById(gameId:$gameId){
        result {
            rounds {
                score0
                score1
            }
            result {
                winner
                output0
                output1
            }
            extra
        }
    }
  }`;

export const getGameInfo = gql`query getGameInfo($gameId: String!) {
    findGameById(gameId:$gameId){
        status
        unit0 {
            unitId
            name
        }
        unit1 {
            unitId
            name
        }
        referee {
            userId
        }
        startTime
        location
    }
}`;

export const getCarouselMatches = gql`query getCarouselMatches {
    getBulletin {
        matchId
        previewLarge
    }
}`;

export const getMatchTypeList = gql`query getMatchTypeList {
    listMatchTypes {
        matchTypeId
        matchTypeName
    }
}`;
