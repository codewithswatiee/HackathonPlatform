const Participant = require('../../models/participant');
const TeamLeader = require('../../models/teamLeader');
const Hackathon = require('../../models/hackathon');

// Generate a unique team code
const generateTeamCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Controller for joining a hackathon
const participateInHackathon = async (req, res) => {
    try {
        const { hackathonId, role, teamCode, participantId } = req.body;

        // Check if the participant is registered
        const participant = await Participant.findById(participantId);
        if (!participant) {
            return res.status(401).json({
                success: false,
                message: 'You must be registered to participate in a hackathon',
            });
        }

        // Check if the hackathon exists
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found',
            });
        }

        const { maxParticipants, minParticipants } = hackathon;

        if (role === 'leader') {
            // Check if the participant is already a team leader for this hackathon
            const existingTeam = await TeamLeader.findOne({ hackathonId, leaderId: participantId });
            if (existingTeam) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already a team leader for this hackathon',
                });
            }

            // Create a new team
            const newTeam = new TeamLeader({
                hackathonId,
                leaderId: participantId,
                teamCode: generateTeamCode(),
            });

            await newTeam.save();

            const updatedHackathon = await Hackathon.findByIdAndUpdate(
                hackathonId,{ $inc: { currentParticipants: 1 } },
                { new: true }   
            )

            if (!updatedHackathon) {
                return res.status(404).json({
                    success: false,
                    message: 'Hackathon not found',
                });
            }

            return res.status(201).json({
                success: true,
                message: 'You have successfully created a team',
                teamCode: newTeam.teamCode,
            });
        } else if (role === 'member') {
            // Validate the team code
            const team = await TeamLeader.findOne({ hackathonId, teamCode });
            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid team code',
                });
            }

            // Check if the team has reached the maximum number of participants
            if (team.teamMembers.length >= maxParticipants) {
                return res.status(400).json({
                    success: false,
                    message: 'This team has already reached the maximum number of participants',
                });
            }

            // Add the participant to the team
            team.teamMembers.push({ memberId: participantId });
            await team.save();

            const updatedHackathon = await Hackathon.findByIdAndUpdate(
                hackathonId,{ $inc: { currentParticipants: 1 } },
                { new: true }   
            )

            if (!updatedHackathon) {
                return res.status(404).json({
                    success: false,
                    message: 'Hackathon not found',
                });
            }

            const updatedParticipant = await Participant.findByIdAndUpdate(
                participantId,
                { $addToSet: { registeredHackathons: hackathonId } },
                { new: true }
            );
            if (!updatedParticipant) {
                return res.status(404).json({
                    success: false,
                    message: 'Participant not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'You have successfully joined the team',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Please choose either "leader" or "member"',
            });
        }
    } catch (error) {
        console.error('Error in participateInHackathon:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request',
            error: error.message,
        });
    }
};


const fetchTeam  = async (req, res) => {
    const { participantId, hackathonId } = req.body;
    console.log('Participant ID:', participantId);
    console.log('Hackathon ID:', hackathonId);
    try {
        if(!participantId || !hackathonId) {
            return res.status(400).json({
                success: false,
                message: 'Participant ID is required',
            });
        }


        const participant = await Participant.findById(participantId);
        if (!participant) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found',
            });
        }

        // Fetch hackathons where the participant is a team leader or member
        const RegisteredHackathon = participant.registeredHackathons || [];

        if(!RegisteredHackathon.length) {
            return res.status(404).json({
                success: false,
                message: 'No registered hackathons found',
            });
        }

        if(!RegisteredHackathon.includes(hackathonId)) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found in registered hackathons',
            });
        }

        // Fetch the team details for the participant in the specified hackathon
        const team = await TeamLeader.findOne({ hackathonId, 'teamMembers.memberId': participantId });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'No team found for the participant in this hackathon',
            });
        }

        // Populate the team members with their details
        await team.populate('teamMembers.memberId', 'name email'); // Populate only name and email fields
        const teamDetails = {
            teamId: team._id,
            teamCode: team.teamCode,
            members: team.teamMembers.map(member => ({
                memberId: member.memberId._id,
                name: member.memberId.name,
                email: member.memberId.email,
            })),
        };

        console.log(teamDetails)

        return res.status(200).json({
            success: true,
            message: 'Registered hackathons fetched successfully',
            teamDetails,
        });
    } catch (error) {
        console.error('Error in fetchRegisteredHackathon:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching registered hackathons',
            error: error.message,
        });
    }
}

module.exports = { participateInHackathon, fetchTeam };