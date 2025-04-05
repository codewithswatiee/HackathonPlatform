'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
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
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-zinc-900 rounded-lg shadow-lg p-8 border border-zinc-800"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Participant Registration</h2>
          <p className="mt-2 text-zinc-400">Join our community of innovators and creators</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index} 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index + 1 <= currentStep ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="h-1 bg-zinc-800 rounded-full">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold border-b border-zinc-800 pb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Full Name {requiredFieldIndicator}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Username {requiredFieldIndicator}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Email Address {requiredFieldIndicator}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Phone Number {requiredFieldIndicator}
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Password {requiredFieldIndicator}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Confirm Password {requiredFieldIndicator}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold border-b border-zinc-800 pb-2">Professional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Organization */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Organization / Institution Name {requiredFieldIndicator}
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Current Role / Designation {requiredFieldIndicator}
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                  </div>

                  {/* Field of Interest */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-zinc-300">
                      Fields of Interest {requiredFieldIndicator}
                    </label>
                    <div ref={dropdownRef} className="mt-1 relative">
                      <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="cursor-pointer w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white shadow-sm focus:border-white focus:ring-white"
                      >
                        {formData.fieldOfInterest.length === 0 ? (
                          <span className="text-zinc-400">Select fields of interest</span>
                        ) : (
                          <span>{formData.fieldOfInterest.join(', ')}</span>
                        )}
                      </div>
                      
                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-zinc-800 border border-zinc-700 shadow-lg">
                          <div className="max-h-60 overflow-auto py-1">
                            {fieldOfInterestOptions.map((field) => (
                              <div
                                key={field}
                                className="flex items-center px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFieldOfInterestChange(field);
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.fieldOfInterest.includes(field)}
                                  onChange={() => {}}
                                  className="h-4 w-4 rounded border-zinc-600 text-white focus:ring-white"
                                />
                                <label className="ml-2 text-sm text-white cursor-pointer">
                                  {field}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {formData.fieldOfInterest.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.fieldOfInterest.map((field) => (
                          <span
                            key={field}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-700 text-white"
                          >
                            {field}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFieldOfInterestChange(field);
                              }}
                              className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-zinc-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {errors.fieldOfInterest && (
                      <p className="text-red-500 text-sm mt-1">{errors.fieldOfInterest}</p>
                    )}
                  </div>

                  {/* LinkedIn Profile */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      LinkedIn Profile {requiredFieldIndicator}
                    </label>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>

                  {/* GitHub Profile */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      GitHub/Portfolio Link {requiredFieldIndicator}
                    </label>
                    <input
                      type="url"
                      name="githubProfile"
                      value={formData.githubProfile}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Profile & Skills */}
            {currentStep === 3 && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold border-b border-zinc-800 pb-2">Profile & Skills</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Profile Picture {requiredFieldIndicator}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-700 border-dashed rounded-md hover:border-white transition-colors">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-zinc-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-zinc-400">
                          <label htmlFor="profilePicture" className="relative cursor-pointer rounded-md font-medium text-white hover:text-zinc-300 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id="profilePicture" name="profilePicture" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Resume
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-700 border-dashed rounded-md hover:border-white transition-colors">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-zinc-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-zinc-400">
                          <label htmlFor="resume" className="relative cursor-pointer rounded-md font-medium text-white hover:text-zinc-300 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id="resume" name="resume" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-zinc-500">PDF, DOC up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300">
                      Age {requiredFieldIndicator}
                    </label>
                    <textarea
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      rows={1}
                      className="mt-1 block w-20 rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>


                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300">
                      Bio/About Me {requiredFieldIndicator}
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>

                  {/* Skills */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300">
                      Skills / Expertise {requiredFieldIndicator}
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Location & Experience */}
            {currentStep === 4 && (
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold border-b border-zinc-800 pb-2">Location & Experience</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      City {requiredFieldIndicator}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300">
                      Country {requiredFieldIndicator}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>

                  {/* Hackathon Experience */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300">
                      Hackathon Experience {requiredFieldIndicator}
                    </label>
                    <textarea
                      name="Experience"
                      value={formData.Experience}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm focus:border-white focus:ring-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="flex justify-between pt-6 border-t border-zinc-800">
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={prevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border border-zinc-700 rounded-md text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
              >
                Previous
              </motion.button>
            )}
            
            <div className="ml-auto flex space-x-3">
              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white 
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white`}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </motion.button>
              )}
            </div>
          </div>
        </form>

        {errors.submit && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {errors.submit}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ParticipantRegistration;