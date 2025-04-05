import { logEvent } from 'firebase/analytics';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { analytics, db, storage } from './config';

// Track events in analytics
const trackEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

// Upload a file to Firebase Storage with progress tracking
export const uploadFile = async (file, hackathonId, userId, onProgress) => {
  try {
    console.log('Starting file upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const fileRef = ref(storage, `hackathons/${hackathonId}/users/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Track progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          trackEvent('document_upload_error', {
            hackathon_id: hackathonId,
            error_message: error.message,
            error_code: error.code
          });
          reject(error);
        },
        async () => {
          try {
            console.log('Upload completed, getting download URL');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Download URL obtained:', downloadURL);
            
            trackEvent('document_uploaded', {
              hackathon_id: hackathonId,
              file_type: file.type,
              file_size: file.size
            });
            
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    trackEvent('document_upload_error', {
      hackathon_id: hackathonId,
      error_message: error.message,
      error_code: error.code
    });
    throw error;
  }
};

// Save document metadata to Firestore
export const saveDocumentMetadata = async (hackathonId, userId, documentData) => {
  try {
    const docRef = await addDoc(collection(db, 'documents'), {
      hackathonId,
      userId,
      ...documentData,
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, approved, rejected
    });
    
    // Track document metadata saved
    trackEvent('document_metadata_saved', {
      hackathon_id: hackathonId,
      document_type: documentData.type
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving document metadata:', error);
    
    // Track metadata save error
    trackEvent('document_metadata_error', {
      hackathon_id: hackathonId,
      error_message: error.message
    });
    
    throw error;
  }
};

// Get user's documents for a hackathon
export const getUserDocuments = async (hackathonId, userId) => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('hackathonId', '==', hackathonId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Track documents fetched
    trackEvent('documents_fetched', {
      hackathon_id: hackathonId,
      document_count: documents.length
    });
    
    return documents;
  } catch (error) {
    console.error('Error getting user documents:', error);
    
    // Track fetch error
    trackEvent('documents_fetch_error', {
      hackathon_id: hackathonId,
      error_message: error.message
    });
    
    throw error;
  }
};

// Update document status
export const updateDocumentStatus = async (documentId, status) => {
  try {
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, { status });
    
    // Track status update
    trackEvent('document_status_updated', {
      document_id: documentId,
      new_status: status
    });
  } catch (error) {
    console.error('Error updating document status:', error);
    
    // Track status update error
    trackEvent('document_status_update_error', {
      document_id: documentId,
      error_message: error.message
    });
    
    throw error;
  }
};

// Save problem statement to Firestore
export const saveProblemStatement = async (hackathonId, problemData) => {
  try {
    const docRef = await addDoc(collection(db, 'problemStatements'), {
      hackathonId,
      ...problemData,
      createdAt: new Date().toISOString()
    });
    
    // Track problem statement created
    trackEvent('problem_statement_created', {
      hackathon_id: hackathonId,
      domain: problemData.domain
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving problem statement:', error);
    
    // Track creation error
    trackEvent('problem_statement_creation_error', {
      hackathon_id: hackathonId,
      error_message: error.message
    });
    
    throw error;
  }
};

// Get problem statements for a hackathon
export const getProblemStatements = async (hackathonId) => {
  try {
    const q = query(
      collection(db, 'problemStatements'),
      where('hackathonId', '==', hackathonId)
    );
    const querySnapshot = await getDocs(q);
    const statements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Track problem statements fetched
    trackEvent('problem_statements_fetched', {
      hackathon_id: hackathonId,
      statement_count: statements.length
    });
    
    return statements;
  } catch (error) {
    console.error('Error getting problem statements:', error);
    
    // Track fetch error
    trackEvent('problem_statements_fetch_error', {
      hackathon_id: hackathonId,
      error_message: error.message
    });
    
    throw error;
  }
}; 