// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract ElectionFact {
    struct ElectionDet {
        address deployedAddress;
        string el_n;
        string el_d;
    }

    mapping(string => ElectionDet) companyEmail;
    
    function createElection(string memory email, string memory election_name, string memory election_description) public {
        address newElection = address(new Election( msg.sender,election_name, election_description));

        companyEmail[email].deployedAddress = newElection;
        companyEmail[email].el_n = election_name;
        companyEmail[email].el_d = election_description;
    }

    function getDeployedElection(string memory email) public view returns (address, string memory, string memory) {
        address val = companyEmail[email].deployedAddress;
        if(val == address(0)) 
            return (address(0),"","Create an election");
        else 
            return (companyEmail[email].deployedAddress,companyEmail[email].el_n,companyEmail[email].el_d);

    }
}

contract Election {
    address public election_authority;
    string public election_name;
    string public election_description;
    bool public status;

    constructor(address  sender,string memory name, string memory description) {
        election_authority = sender;
        election_name = name;
        election_description = description;
        status = true;
    }

    modifier onlyOwner() {
        require(msg.sender == election_authority, "Error: Access Denied.");
        _;
    }

    struct Candidate {
        string candidate_name;
        string candidate_description;
        string imgHash;
        string email;
    }

    mapping(uint256 => Candidate) public candidates;

    mapping(string => bool) public isVoted;
    mapping(uint256 => uint256) public votes;

    uint256 public numCandidates;
    uint256 public numVoters;

    function addCandidate(string[] memory candidate_name, string[] memory candidate_description, string[] memory imgHash, string[] memory email) public onlyOwner {
        require(candidate_name.length == candidate_description.length && candidate_name.length == imgHash.length && candidate_name.length == email.length,"Candidates attributes must have equal length");
        for(uint i = 0;i < candidate_name.length;i++) {
            uint256 candidateID = numCandidates++;
            candidates[candidateID] = Candidate(candidate_name[i], candidate_description[i], imgHash[i], email[i]);

        }
    } 

    function vote(uint256 candidateID,string memory _id) public {
        require(!isVoted[_id], "Error: You cannot double vote");
        require(status,"Election has Ended");

        isVoted[_id] = true;
        numVoters++;
        votes[candidateID]++;
    }

    function endElection() public onlyOwner{
        status = false;
    }
   

    function getNumOfCandidates() public view returns(uint256) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint256) {
        return numVoters;
    }

    function getCandidate(uint256 candidateID) public view returns (string memory, string memory, string memory, string memory) {
        return (candidates[candidateID].candidate_name, candidates[candidateID].candidate_description, candidates[candidateID].imgHash, candidates[candidateID].email);
    }

    function getElectionDetails() public view returns(string memory, string memory) {
        return (election_name, election_description);
    }

    function getWinner() public view returns (string memory, uint256, string memory) {
    uint256 winningVoteCount = 0;
    uint256 winningCandidateID = 0;
    bool isTie = false;
        for (uint256 i = 0; i < numCandidates; i++) {
            if (votes[i] > winningVoteCount) {
                winningVoteCount = votes[i];
                winningCandidateID = i;
                isTie = false; // Reset the tie flag as we have a new winner
            } else if (votes[i] == winningVoteCount) {
                // This means there is another candidate with the same number of votes as the current winner
                isTie = true;
            }
        }
        if (isTie) {
            return ("", 0, "It's a tie!");
        } else {
            return (candidates[winningCandidateID].candidate_name, winningCandidateID, "");
        }
    }
}
