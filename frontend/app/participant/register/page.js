'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const ParticipantRegistration = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: '',
    fieldOfInterest: [],
    linkedinProfile: '',
    githubProfile: '',
    profilePicture: null,
    bio: '',
    skills: '',
    resume: null,
    Experience: '',
    city: '',
    country: '',
    age: '',
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fieldOfInterestOptions = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'AI',
    'Cyber Security',
    'Cloud Computing',
    'DevOps',
    'Blockchain',
    'Game Development'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFieldOfInterestChange = (field) => {
    setFormData(prev => ({
      ...prev,
      fieldOfInterest: prev.fieldOfInterest.includes(field)
        ? prev.fieldOfInterest.filter(f => f !== field)
        : [...prev.fieldOfInterest, field]
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const stepErrors = {};
    if (!formData.fullName.trim()) stepErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) stepErrors.email = 'Email is required';
    if (!formData.password) stepErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.username.trim()) stepErrors.username = 'Username is required';
    if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = 'Phone number is required';
    return stepErrors;
  };

  const validateStep2 = () => {
    const stepErrors = {};
    if (!formData.organization.trim()) stepErrors.organization = 'Organization is required';
    if (!formData.role.trim()) stepErrors.role = 'Role is required';
    if (!formData.fieldOfInterest || formData.fieldOfInterest.length === 0) {
      stepErrors.fieldOfInterest = 'At least one field of interest is required';
    }
    if (!formData.linkedinProfile.trim()) stepErrors.linkedinProfile = 'LinkedIn profile is required';
    if (!formData.githubProfile.trim()) stepErrors.githubProfile = 'GitHub/Portfolio link is required';
    return stepErrors;
  };

  const validateStep3 = () => {
    const stepErrors = {};
    if (!formData.bio.trim()) stepErrors.bio = 'Bio is required';
    if (!formData.skills.trim()) stepErrors.skills = 'Skills are required';
    if (!formData.age) stepErrors.age = 'Age is required';
    return stepErrors;
  };

  const validateStep4 = () => {
    const stepErrors = {};
    if (!formData.city.trim()) stepErrors.city = 'City is required';
    if (!formData.country.trim()) stepErrors.country = 'Country is required';
    if (!formData.Experience.trim()) stepErrors.Experience = 'Hackathon experience is required';
    return stepErrors;
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      default:
        return {};
    }
  };

  const nextStep = () => {
    const stepErrors = validateCurrentStep();
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.text-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Add useEffect for handling clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update handleSubmit to include final validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateCurrentStep();
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      const firstErrorField = document.querySelector('.text-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Make API call to register participant
      const response = await axios.post('http://localhost:7000/api/participant/register', {
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        profilePicture: formData.profilePicture || "", // Optional, can be left empty if not provided
        age: formData.age,
        experience: formData.Experience,
        skills: formData.skills,
        githubLink: formData.githubProfile,
        linkedIn: formData.linkedinProfile,
        organization: formData.organization,
        feildOfInterest: formData.fieldOfInterest, // Ensure correct spelling in your formData
        bio: formData.bio,
        city: formData.city,
        country: formData.country,
        resume: formData.resume || ""
      });

      if(response.status !== 201){
        alert(response.data.error || "Error while creating account")
      }

      alert('Registration Successful')

      // Redirect to dashboard on success
      router.push('/participant/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to register. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this near the start of your JSX, after the form title:
  const requiredFieldIndicator = <span className="text-red-500 ml-1">*</span>;

  return (
    <main className="min-h-screen bg-zinc-900 font-['Lilita_One']">
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
      `}</style>
      
      <div className="flex items-center justify-center min-h-screen py-8 px-6">
        <div className="w-full max-w-4xl bg-zinc-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl text-white tracking-tight">PARTICIPANT REGISTRATION</h2>
            <p className="mt-2 text-gray-300 text-sm font-sans">Join our community of innovators and creators</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index + 1 <= currentStep ? 'bg-white text-[#e74c3c]' : 'bg-[#666666] text-white'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="h-2 bg-[#666666] rounded-full">
              <motion.div 
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl text-white pb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">👤</span>
                    </div>
                    {errors.fullName && <p className="text-red-500 text-sm mt-1 pl-4">{errors.fullName}</p>}
                  </div>

                  {/* Username */}
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">@</span>
                    </div>
                    {errors.username && <p className="text-red-500 text-sm mt-1 pl-4">{errors.username}</p>}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">✉️</span>
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1 pl-4">{errors.email}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">📱</span>
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1 pl-4">{errors.phoneNumber}</p>}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">🔒</span>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1 pl-4">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">🔒</span>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 pl-4">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 mt-3">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full py-3 rounded-full bg-gray-700 text-white text-xl hover:bg-gray-600 focus:outline-none transition-all"
                  >
                    BACK
                  </button>
                )}
              </div>
              <div className="md:col-span-2">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full py-3 rounded-full bg-white text-[#e74c3c] text-xl hover:bg-gray-100 focus:outline-none transition-all"
                  >
                    NEXT
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-full text-xl hover:bg-gray-100 focus:outline-none transition-all ${
                      isSubmitting 
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                        : 'bg-white text-[#e74c3c]'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SIGN UP'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ParticipantRegistration;