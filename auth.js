// Notification system
function showNotification(message, type = 'info', duration = 5000) {
  const container = document.getElementById('notification-container');
  const notification = document.createElement('div');
  
  // Base classes
  let classes = 'p-4 mb-2 rounded-lg shadow-lg transition-all duration-300 transform';
  
  // Add type-specific classes
  switch(type) {
    case 'success':
      classes += ' bg-green-100 text-green-800 border-l-4 border-green-500';
      break;
    case 'error':
      classes += ' bg-red-100 text-red-800 border-l-4 border-red-500';
      break;
    case 'warning':
      classes += ' bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
      break;
    default:
      classes += ' bg-blue-100 text-blue-800 border-l-4 border-blue-500';
  }
  
  notification.className = classes;
  notification.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        ${type === 'success' ? 
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
          type === 'error' ?
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' :
          type === 'warning' ?
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>' :
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  // Add to container
  container.appendChild(notification);
  
  // Slide in effect
  setTimeout(() => {
    notification.classList.add('translate-x-0');
    notification.classList.remove('translate-x-full');
  }, 10);
  
  // Auto-remove after duration
  setTimeout(() => {
    notification.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => {
      container.removeChild(notification);
    }, 300);
  }, duration);
}

// OTP input handling
function setupOTPInputs() {
  const otpBoxes = document.querySelectorAll('.otp-box');
  
  if (otpBoxes.length > 0) {
    otpBoxes.forEach((box, index) => {
      // Focus next box on input
      box.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      });
      
      // Handle backspace
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
          otpBoxes[index - 1].focus();
        }
      });
    });
  }
}

// Get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(window.location.search);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Check if we're on the OTP page and set up accordingly
document.addEventListener('DOMContentLoaded', function() {
  setupOTPInputs();
  
  // If on OTP page, display the email and set up form submission
  if (document.getElementById('otpForm')) {
    const email = localStorage.getItem('otpEmail') || getUrlParameter('email');
    if (email) {
      document.getElementById('emailDisplay').textContent = 
        `Enter the verification code we just sent to ${email}`;
    }
    
    // OTP form submission
// OTP form submission
document.getElementById('otpForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const otpBoxes = document.querySelectorAll('.otp-box');
  const otp = Array.from(otpBoxes).map(box => box.value).join('');
  const email = localStorage.getItem('otpEmail') || getUrlParameter('email');

  if (otp.length !== 6) {
    showNotification('Please enter a complete 6-digit OTP', 'error');
    return;
  }

  try {
    const verifyBtn = document.getElementById('verifyBtn');
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = 'Verifying...';

    const response = await axios.post('https://cms.aekads.com/api/websitesales/verify-otp', {
      email: email,
      otp: otp
    });

    showNotification(response.data.message, 'success');

    // ✅ Store token, userId, and email
  if (response.data.token) {
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('userId', response.data.id || response.data.userId);
  localStorage.setItem('userEmail', response.data.email || email);

  // ✅ Check if user had pending redirect (like from Create Campaign)
  const redirectPath = sessionStorage.getItem("redirectAfterLogin");
  if (redirectPath) {
    sessionStorage.removeItem("redirectAfterLogin"); // clear after use
    window.location.href = redirectPath; 
  } else {
    // Default fallback → property listing
    window.location.href = '/Property-listing.html'; 
  }
}
  } catch (error) {
    verifyBtn.disabled = false;
    verifyBtn.innerHTML = 'Verify';

    if (error.response) {
      showNotification(error.response.data.error, 'error');
    } else {
      showNotification('Network error. Please try again.', 'error');
    }
  }
});

    
    // Resend OTP link
    document.getElementById('resendLink').addEventListener('click', async function(e) {
      e.preventDefault();
      
      const email = localStorage.getItem('otpEmail') || getUrlParameter('email');
      if (!email) {
        showNotification('Email not found. Please try logging in again.', 'error');
        return;
      }
      
      try {
        const resendLink = document.getElementById('resendLink');
        resendLink.textContent = 'Sending...';
        
        const response = await axios.post('https://cms.aekads.com/api/websitesales/login', {
          email: email,
          password: localStorage.getItem('tempPassword')
        });
        
        showNotification('New OTP sent to your email', 'success');
        resendLink.textContent = 'Resend';
      } catch (error) {
        resendLink.textContent = 'Resend';
        if (error.response) {
          showNotification(error.response.data.error, 'error');
        } else {
          showNotification('Failed to resend OTP. Please try again.', 'error');
        }
      }
    });
  }
  
  // If on login page, set up login form submission
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Signing in...';
        
        const response = await axios.post('https://cms.aekads.com/api/websitesales/login', {
          email: email,
          password: password
        });
        
        showNotification(response.data.message, 'success');
        
        // Store email and password temporarily for OTP verification
        localStorage.setItem('otpEmail', email);
        localStorage.setItem('tempPassword', password);
        
        // Redirect to OTP page
        setTimeout(() => {
          window.location.href = `loginotp.html?email=${encodeURIComponent(email)}`;
        }, 1500);
      } catch (error) {
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign in';
        
        if (error.response) {
          showNotification(error.response.data.error, 'error');
        } else {
          showNotification('Network error. Please try again.', 'error');
        }
      }
    });
  }
});
