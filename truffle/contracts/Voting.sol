// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title DApp Voting system
/// @author Victorien Lambert
/// @notice A voting system with an owner to add voters and organize the different voting sessions. 
/// @notice And registered voters who will be able to add proposals and vote for them.
contract Voting is Ownable {

    uint public winningProposalID;
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId, string proposal);
    event Voted (address voter, uint proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /// @notice Get the struct of a voter from his address
    /// @dev onlyVoters modifier, a person must be registered as a voter to use the feature
    /// @param _addr Address of the voter
    /// @return The struc of the voter
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Get one proposal from his id
    /// @dev onlyVoters modifier, a person must be registered as a voter to use the feature
    /// @param _id This is the id of the table of proposals
    /// @return the proposal, description and number of votes
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }
    
 
    // ::::::::::::: REGISTRATION ::::::::::::: // 
    
    /// @notice Add a new voter
    /// @dev onlyOwner modifier from Ownable of the OpenZeppelin library is used
    /// @param _addr The address of a new voter
    /// @custom:require registration open and voters registered
    /// @custom:emit The address of the newly registered voter
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 

    /// @notice Voters can add a proposal
    /// @dev onlyVoters modifier, a person must be registered as a voter to use the feature
    /// @param _desc The description of the proposal
    /// @custom:emit The id of the registered proposal
    /// @custom:require proposal is not empty and proposal session is open, the proposal array is also limited to 100 for preventing Dos attack
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        require(proposalsArray.length <= 100, "The limit of proposals has been reached"); // Dos protection
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1, _desc);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Vote for a proposal from its id
    /// @dev onlyVoters modifier, a person must be registered as a voter to use the feature
    /// @param _id The id of the proposal to vote for
    /// @custom:emit The voter's address and the id of the proposal they voted for
    /// @custom:require The current session must be voting started, the id must exist and the voters have not already voted
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Start the proposal registration session
    /// @dev onlyOwner modifier from Ownable of the OpenZeppelin library is used
    /// @custom:emit The previous and the new workflow status
    /// @custom:require The current session must be registering voters
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice End the proposal recording session
    /// @dev onlyOwner modifier from Ownable of the OpenZeppelin library is used
    /// @custom:emit The previous and the new workflow status
    /// @custom:require The current session must be proposal registration started
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Start the voting session
    /// @dev onlyOwner modifier from Ownable of the OpenZeppelin library is used
    /// @custom:emit The previous and the new workflow status
    /// @custom:require The current session must be proposal registration ended
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice End the voting session
    /// @dev onlyOwner modifier from Ownable of the OpenZeppelin library is used
    /// @custom:emit The previous and the new workflow status
    /// @custom:require The current session must be voting started
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Counting of votes and selection of the winner
    /// @dev onlyOwner modifier from Ownable of the OpenZeppelin library is used
    /// @custom:emit The previous and the new workflow status
    /// @custom:require The current session must be voting ended
    function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;
        
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    // function startVoterRegistering() external onlyOwner {
    //     require(workflowStatus == WorkflowStatus.VotingSessionEnded, 'Voting session havent ended yet');
    //     workflowStatus = WorkflowStatus.RegisteringVoters;
    //     emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.RegisteringVoters);
    // }
}