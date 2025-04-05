import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract data from formData
    const participant = {
      fullName: formData.get('fullName'),
      username: formData.get('username'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      password: formData.get('password'),
      organization: formData.get('organization'),
      role: formData.get('role'),
      fieldOfInterest: formData.get('fieldOfInterest'),
      linkedinProfile: formData.get('linkedinProfile'),
      githubProfile: formData.get('githubProfile'),
      bio: formData.get('bio'),
      skills: formData.get('skills'),
      hackathonExperience: formData.get('hackathonExperience'),
      city: formData.get('city'),
      country: formData.get('country'),
    };

    // Get files
    const profilePicture = formData.get('profilePicture');
    const resume = formData.get('resume');

    // Validate required fields
    if (!participant.fullName || !participant.email || !participant.password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(participant.password, 10);
    participant.password = hashedPassword;

    // TODO: Save files to storage (e.g. S3, local filesystem)
    // For now, we'll just log that we received them
    if (profilePicture) {
      console.log('Received profile picture:', profilePicture.name);
    }
    if (resume) {
      console.log('Received resume:', resume.name);
    }

    // TODO: Save participant data to database
    // For now, we'll just create a token and return success
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: 'temp-id', // Replace with actual user ID from database
        email: participant.email,
        role: 'participant'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      { 
        message: 'Registration successful',
        token,
        user: {
          fullName: participant.fullName,
          email: participant.email,
          role: 'participant'
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 