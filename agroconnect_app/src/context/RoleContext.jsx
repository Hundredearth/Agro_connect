import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  ta: {
    // General
    "AgroConnect": "அக்ரோகனெக்ட்",
    "Farmer Portal": "விவசாயி போர்டல்",
    "Seller Portal": "விற்பனையாளர் போர்டல்",
    "Customer Portal": "வாடிக்கையாளர் போர்டல்",
    "Home": "முகப்பு",
    "Market": "சந்தை",
    "Scan": "ஸ்கேன்",
    "Products": "தயாரிப்புகள்",
    "Profile": "சுயவிவரம்",
    "Stock": "இருப்பு",
    "Orders": "ஆர்டர்கள்",
    "Farmers": "விவசாயிகள்",
    "Loading...": "ஏற்றுகிறது...",
    "Server error": "சேவையக பிழை",

    // Auth
    "Welcome Back": "மீண்டும் வருக!",
    "Login to access your agricultural gateway": "உங்கள் விவசாய கணக்கை அணுக உள்நுழையவும்",
    "Create Account": "கணக்கு உருவாக்கவும்",
    "Join the modern smart farming marketplace": "நவீன ஸ்மார்ட் விவசாய சந்தையில் இணையுங்கள்",
    "Email Address": "மின்னஞ்சல் முகவரி",
    "Password": "கடவுச்சொல்",
    "Full Name": "முழு பெயர்",
    "Phone Number": "தொலைபேசி எண்",
    "Address": "முகவரி",
    "Select Role": "பாத்திரத்தைத் தேர்ந்தெடுக்கவும்",
    "Farmer": "விவசாயி",
    "Seller": "விற்பனையாளர்",
    "Customer": "வாடிக்கையாளர்",
    "Farm Size (Acres)": "பண்ணை அளவு (ஏக்கர்)",
    "Company Name": "நிறுவனத்தின் பெயர்",
    "Already have an account?": "ஏற்கனவே கணக்கு உள்ளதா?",
    "Sign In": "உள்நுழையவும்",
    "Don't have an account?": "கணக்கு இல்லையா?",
    "Sign Up": "பதிவு செய்யவும்",
    "Language": "மொழி",
    "Select Language": "மொழியைத் தேர்ந்தெடுக்கவும்",
    "Select Role to Register": "பதிவு செய்ய பாத்திரத்தைத் தேர்ந்தெடுக்கவும்",
    "Invalid credentials": "தவறான நற்சான்றிதழ்கள்",

    // Home
    "Daily Dashboard": "தினசரி டாஷ்போர்டு",
    "Smart Agriculture Overview": "ஸ்மார்ட் விவசாய கண்ணோட்டம்",
    "Market Overview": "சந்தை மேலோட்டம்",
    "Temperature": "வெப்பநிலை",
    "Soil Moisture": "மண் ஈரப்பதம்",
    "Optimal": "உகந்தது",
    "Humid": "ஈரப்பதம்",
    "Pest Status": "பூச்சி நிலை",
    "None Detected": "கண்டறியப்படவில்லை",
    "Weather Advisory": "வானிலை ஆலோசனை",
    "Perfect day for irrigation and sowing seeds.": "நீர்ப்பாசனம் மற்றும் விதை விதைப்பதற்கு உகந்த நாள்.",
    "Community Alerts": "சமூக விழிப்பூட்டல்கள்",
    "Local Crop Hazard Advisories": "உள்ளூர் பயிர் அபாய ஆலோசனைகள்",
    "Report Pest or Crop Issue": "பூச்சி அல்லது பயிர் பிரச்சனையைப் புகாரளிக்கவும்",
    "Hazards within 5km from your coordinates": "உங்கள் இருப்பிடத்திலிருந்து 5 கி.மீ எல்லைக்குள் உள்ள அபாயங்கள்",
    "No hazard reports nearby. Keep scanning!": "அருகில் எந்த ஆபத்து அறிக்கைகளும் இல்லை. தொடர்ந்து ஸ்கேன் செய்யுங்கள்!",
    "Report Hazard": "ஆபத்தை புகாரளிக்கவும்",
    "Hazard Type": "ஆபத்து வகை",
    "Select hazard type": "ஆபத்து வகையைத் தேர்ந்தெடுக்கவும்",
    "Pest": "பூச்சி",
    "Disease": "நோய்",
    "Weather": "வானிலை",
    "Hazard Title": "ஆபத்து தலைப்பு",
    "e.g. Swarm of Locusts": "எ.கா. வெட்டுக்கிளி கூட்டம்",
    "Hazard Description": "ஆபத்து விளக்கம்",
    "Describe what you see...": "நீங்கள் காண்பதை விவரிக்கவும்...",
    "Submitting...": "சமர்ப்பிக்கிறது...",
    "Report Submitted!": "அறிக்கை சமர்ப்பிக்கப்பட்டது!",

    // Market
    "Agri-Market": "விவசாய சந்தை",
    "Premium wholesale supplies": "பிரீமியம் மொத்த பொருட்கள்",
    "Seeds, tools, fertilizers...": "விதைகள், கருவிகள், உரங்கள்...",
    "All": "அனைத்தும்",
    "Seeds": "விதைகள்",
    "Fertilizer": "உரம்",
    "Tools": "கருவிகள்",
    "Chemicals": "இரசாயனங்கள்",
    "Agri-Market Listings": "விவசாய சந்தை பட்டியல்கள்",
    "Results Found": "முடிவுகள் கண்டறியப்பட்டன",
    "Price": "விலை",
    "By": "தயாரித்தவர்",
    "Buy Now": "வாங்கவும்",
    "Out of stock": "இருப்பு இல்லை",
    "Alert Hub": "விழிப்பூட்டல் மையம்",
    "Market Status Alerts": "சந்தை நிலை விழிப்பூட்டல்கள்",
    "Seller Contact info": "விற்பனையாளர் தொடர்பு விவரம்",
    "Order Approved!": "ஆர்டர் அங்கீகரிக்கப்பட்டது!",
    "Request Rejected": "கோரிக்கை நிராகரிக்கப்பட்டது",
    "Order Pending": "ஆர்டர் நிலுவையில் உள்ளது",
    "Buy Item": "பொருளை வாங்கவும்",
    "Available Stock": "கிடைக்கும் இருப்பு",
    "Enter Quantity": "அளவை உள்ளிடவும்",
    "Confirm Order": "ஆர்டரை உறுதிசெய்",
    "Units": "அலகுகள்",

    // Profile & Settings
    "Account Settings": "கணக்கு அமைப்புகள்",
    "Verified": "சரிபார்க்கப்பட்டது",
    "Sign Out": "வெளியேறவும்",
    "Produce Inventory": "உற்பத்தி இருப்பு",
    "Performance Summary": "செயல்திறன் சுருக்கம்",
    "Sales Volume": "விற்பனை அளவு",
    "Avg Rating": "சராசரி மதிப்பீடு",
    "Update Inventory": "இருப்பை புதுப்பிக்கவும்",
    "Add New Listing": "புதிய பட்டியலைச் சேர்க்கவும்",
    "Item Name": "பொருளின் பெயர்",
    "Quantity (kg)": "அளவு (கிலோ)",
    "Price ($ / kg)": "விலை ($ / கிலோ)",
    "Location Details": "இருப்பிட விவரங்கள்",
    "Save Changes": "மாற்றங்களைச் சேமி",
    "Edit Profile & Settings": "சுயவிவரம் மற்றும் அமைப்புகளைத் திருத்தவும்",
    "Language Settings": "மொழி அமைப்புகள்",
    "Close": "மூடு",
    "Account Details": "கணக்கு விவரங்கள்",
    "Delivery Address": "விநியோக முகவரி",
    "Payment Method": "கட்டண முறை",

    // Role specific Completer
    "Complete Profile": "சுயவிவரத்தை நிறைவு செய்க",
    "Enter details to active role": "பாத்திரத்தை செயல்படுத்த விவரங்களை உள்ளிடவும்",
    "Save & Activate": "சேமித்து செயல்படுத்து",

    // Comprehensive localization translations
    // Common / Restricted
    "Access Restricted": "அணுகல் கட்டுப்படுத்தப்பட்டுள்ளது",
    "Only sellers can manage input inventory here.": "விற்பனையாளர்கள் மட்டுமே இங்கு இருப்புப் பொருட்களை நிர்வகிக்க முடியும்.",
    "Access Denied": "அணுகல் மறுக்கப்பட்டது",
    "Please switch to a Customer, Farmer, or Seller role to track orders.": "ஆர்டர்களைக் கண்காணிக்க வாடிக்கையாளர், விவசாயி அல்லது விற்பனையாளர் பாத்திரத்திற்கு மாறவும்.",
    "Only farmer accounts can view product listings.": "விவசாயி கணக்குகள் மட்டுமே தயாரிப்பு பட்டியல்களைப் பார்க்க முடியும்.",
    "Go Home": "முகப்பிற்குச் செல்",
    "Market Not Available": "சந்தை கிடைக்கவில்லை",
    "The Agri-Market is currently optimized for Farmers to purchase supplies.": "விவசாய சந்தை தற்போது விவசாயிகள் பொருட்கள் வாங்குவதற்கு உகந்ததாக வடிவமைக்கப்பட்டுள்ளது.",
    "Loading inventory...": "இருப்பை ஏற்றுகிறது...",
    "Loading orders...": "ஆர்டர்களை ஏற்றுகிறது...",
    "Loading products...": "தயாரிப்புகளை ஏற்றுகிறது...",
    "N/A": "இல்லை",
    "Confirm": "உறுதிப்படுத்து",
    "Cancel": "ரத்துசெய்",
    "Success": "வெற்றி",

    // Home / Dashboard
    "Fresh Harvest": "புதிய அறுவடை",
    "Local & Organic Selection": "உள்ளூர் மற்றும் இயற்கை தயாரிப்புகள்",
    "Trending Nearby": "அருகில் பிரபலமாக உள்ளவை",
    "Support Your Local Agriculture Heroes": "உங்கள் உள்ளூர் விவசாய வீரர்களுக்கு ஆதரவளிக்கவும்",
    "Explore Farms": "பண்ணைகளை ஆராயுங்கள்",
    "Recent Listings": "சமீபத்திய பட்டியல்கள்",
    "See All": "அனைத்தையும் காட்டு",
    "No produce listed yet.": "தயாரிப்புகள் எதுவும் இன்னும் பட்டியலிடப்படவில்லை.",
    "Stock:": "இருப்பு:",
    "Commerce Center": "வணிக மையம்",
    "Supply Chain Manager": "வழங்கல் சங்கிலி மேலாளர்",
    "STOCK ITEMS": "இருப்பு பொருட்கள்",
    "Active Store Stock": "செயலில் உள்ள கடை இருப்பு",
    "DAILY ORDERS": "தினசரி ஆர்டர்கள்",
    "Processing Now": "இப்போது செயலாக்கப்படுகிறது",
    "Control Center": "கட்டுப்பாட்டு மையம்",
    "Add New Supply": "புதிய விநியோகத்தைச் சேர்",
    "Update seeds, tools, or inputs": "விதைகள், கருவிகள் அல்லது உள்ளீடுகளைப் புதுப்பிக்கவும்",
    "Order Management": "ஆர்டர் மேலாண்மை",
    "Fulfill customer requests": "வாடிக்கையாளர் கோரிக்கைகளை நிறைவேற்றவும்",
    "Farmer Portal": "விவசாயி போர்டல்",
    "Currently observed conditions": "தற்போது கவனித்த வானிலை நிலவரங்கள்",
    "Humidity": "ஈரப்பதம்",
    "Wind Speed": "காற்றின் வேகம்",
    "Soil Moisture": "மண் ஈரப்பதம்",
    "Within 5km radius (Last 24h)": "5 கி.மீ எல்லைக்குள் (கடந்த 24 மணிநேரத்தில்)",
    "No threats in your 5km range": "உங்கள் 5 கி.மீ எல்லைக்குள் எந்த ஆபத்துகளும் இல்லை",
    "Tap the '+' button above to report any pest activity or disease warnings you spot!": "நீங்கள் காணும் பூச்சி நடமாட்டம் அல்லது நோய் எச்சரிக்கைகளைப் புகாரளிக்க மேலே உள்ள '+' பொத்தானைத் தட்டவும்!",
    "Farmer Services": "விவசாயி சேவைகள்",
    "AI Crop Diagnostic": "AI பயிர் நோய் கண்டறிதல்",
    "Scan crops for instant health analysis": "உடனடி பயிர் ஆரோக்கிய பகுப்பாய்விற்குப் பயிர்களை ஸ்கேன் செய்யுங்கள்",
    "Buy seeds and pesticides from sellers": "விற்பனையாளர்களிடமிருந்து விதைகள் மற்றும் பூச்சிக்கொல்லிகளை வாங்கவும்",
    "AgroAI Assistant": "அக்ரோAI உதவியாளர்",
    "Chat with your personalized farm expert": "உங்கள் தனிப்பயனாக்கப்பட்ட பண்ணை நிபுணருடன் அரட்டையடிக்கவும்",
    "Report Threat": "ஆபத்தைப் புகாரளிக்கவும்",
    "Warn local farmers in 5km": "5 கி.மீ-க்குள் உள்ள உள்ளூர் விவசாயிகளை எச்சரிக்கவும்",
    "Threat Type": "ஆபத்து வகை",
    "Disease Sighting": "நோய் கண்டறிதல்",
    "Pest Infestation": "பூச்சி பாதிப்பு",
    "Extreme Weather": "கடுமையான வானிலை",
    "Title": "தலைப்பு",
    "Description": "விளக்கம்",
    "Post Live Warning": "நேரடி எச்சரிக்கையைப் பதிவிடவும்",
    "e.g. Tomato Leaf Rust spotted": "எ.கா. தக்காளி இலை துரு நோய் கண்டறியப்பட்டது",
    "Describe crop symptoms, weather, severity...": "பயிர் அறிகுறிகள், வானிலை, தீவிரம் ஆகியவற்றை விவரிக்கவும்...",
    "Purchase request sent successfully!": "வாங்குவதற்கான கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது!",
    "Failed to place request": "கோரிக்கையை சமர்ப்பிக்க முடியவில்லை",
    "Failed to post community alert.": "சமூக எச்சரிக்கையைப் பதிவிட முடியவில்லை.",

    // Store Inventory / Products
    "Store Inventory": "கடை இருப்பு",
    "Manage your agricultural supplies": "உங்கள் விவசாயப் பொருட்களை நிர்வகிக்கவும்",
    "Total Stock": "மொத்த இருப்பு",
    "Active Items": "செயலில் உள்ள பொருட்கள்",
    "Search inventory products...": "இருப்புத் தயாரிப்புகளைத் தேடவும்...",
    "No stock items listed": "இருப்புப் பொருட்கள் எதுவும் பட்டியலிடப்படவில்லை",
    "Add fertilizer, seeds, or other tools so farmers can purchase them!": "விவசாயிகள் வாங்குவதற்கு உரங்கள், விதைகள் அல்லது பிற கருவிகளைச் சேர்க்கவும்!",
    "Create First Listing": "முதல் பட்டியலை உருவாக்கவும்",
    "Seller listing": "விற்பனையாளர் பட்டியல்",
    "High quality agricultural farming inputs.": "உயர்தர விவசாய உள்ளீடுகள்.",
    "units in stock": "அலகுகள் இருப்பில் உள்ளன",
    "Edit Details": "விவரங்களைத் திருத்தவும்",
    "Delete List": "பட்டியலை நீக்கவும்",
    "Cannot delete listing! Stock must be empty (0) to delete this item.": "பட்டியலை நீக்க முடியாது! இந்த உருப்படியை நீக்க இருப்பு காலியாக (0) இருக்க வேண்டும்.",
    "Are you sure you want to delete this listing?": "இந்த பட்டியலை நீக்க விரும்புகிறீர்கள் என்பதில் உறுதியாக உள்ளீர்களா?",
    "List New Product": "புதிய தயாரிப்பைப் பட்டியலிடுக",
    "Add stock item to store": "கடைக்கு இருப்புப் பொருளைச் சேர்க்கவும்",
    "Product Name": "தயாரிப்பு பெயர்",
    "Location / Place": "இருப்பிடம் / இடம்",
    "e.g. Organic Tomato Seeds": "எ.கா. இயற்கை தக்காளி விதைகள்",
    "Provide details about active ingredients, benefits...": "செயலில் உள்ள பொருட்கள், நன்மைகள் பற்றிய விவரங்களை வழங்கவும்...",
    "e.g. Sector C Warehouse, City Center": "எ.கா. செக்டார் சி கிடங்கு, நகர மையம்",
    "Price ($)": "விலை ($)",
    "e.g. 14.99": "எ.கா. 14.99",
    "Initial Stock": "தொடக்க இருப்பு",
    "e.g. 50": "எ.கா. 50",
    "Image URL (Optional)": "படம் URL (விருப்பத்தேர்வு)",
    "Publish Store Product": "கடை தயாரிப்பை வெளியிடுக",
    "Edit Listing": "பட்டியலைத் திருத்தவும்",
    "Update stock item details": "இருப்புப் பொருள் விவரங்களைப் புதுப்பிக்கவும்",
    "Save Product Listing": "தயாரிப்பு பட்டியலைச் சேமிக்கவும்",

    // Orders Page
    "My Purchases": "எனது கொள்முதல்கள்",
    "Pickup approved orders": "அங்கீகரிக்கப்பட்ட ஆர்டர்களைப் பெறவும்",
    "No active orders": "செயலில் உள்ள ஆர்டர்கள் எதுவும் இல்லை",
    "Approved crop requests will show here with farmers pickup address.": "அங்கீகரிக்கப்பட்ட பயிர் கோரிக்கைகள் விவசாயிகளின் முகவரியுடன் இங்கே காண்பிக்கப்படும்.",
    "Approved": "அங்கீகரிக்கப்பட்டது",
    "Farmer Contact": "விவசாயி தொடர்பு விவரம்",
    "Agri-Market Orders": "விவசாய சந்தை ஆர்டர்கள்",
    "Incoming wholesaler demands": "உள்வரும் மொத்த விற்பனையாளர் தேவைகள்",
    "No incoming orders": "உள்வரும் ஆர்டர்கள் எதுவும் இல்லை",
    "Orders placed by farmers for your listed stock will appear here.": "விவசாயிகள் உங்கள் இருப்புப் பொருட்களுக்காகச் செய்த ஆர்டர்கள் இங்கே தோன்றும்.",
    "Farmer Pickup Details": "விவசாயி தொடர்பு விவரங்கள்",
    "Item Details": "பொருளின் விவரங்கள்",
    "Supply item": "விநியோகப் பொருள்",
    "units": "அலகுகள்",
    "Phone:": "தொலைபேசி எண்:",
    "Address:": "முகவரி:",
    "Approve Demand": "கோரிக்கையை அங்கீகரி",
    "Reject": "நிராகரி",
    "Demand Approved & Released": "கோரிக்கை அங்கீகரிக்கப்பட்டு வெளியிடப்பட்டது",
    "Demand Rejected": "கோரிக்கை நிராகரிக்கப்பட்டது",
    "Wholesale Supplies": "மொத்த விநியோகம்",
    "Track purchases from marketplace": "சந்தையிலிருந்து வாங்கியவற்றைக் கண்காணிக்கவும்",
    "No wholesale orders": "மொத்த ஆர்டர்கள் எதுவும் இல்லை",
    "When you buy wholesale seeds or tools, the orders will track here.": "நீங்கள் மொத்தமாக விதைகள் அல்லது கருவிகளை வாங்கும் போது, ஆர்டர்கள் இங்கே கண்காணிக்கப்படும்.",
    "Seller Contact Approved!": "விற்பனையாளர் தொடர்பு அங்கீகரிக்கப்பட்டது!",
    "Waiting for seller to approve and release contact details.": "விற்பனையாளர் தொடர்பு விவரங்களை அங்கீகரித்து வெளியிடுவதற்காகக் காத்திருக்கிறது.",
    "Seller rejected this supply request. Please search other listings.": "விற்பனையாளர் இந்த விநியோகக் கோரிக்கையை நிராகரித்துள்ளார். தயவுசெய்து பிற பட்டியல்களைத் தேடவும்.",

    // Crop Diagnostic (Scan) Page
    "Crop Diagnostic": "பயிர் நோய் கண்டறிதல்",
    "AI-Powered Analysis": "AI-மூலம் பகுப்பாய்வு",
    "Position leaf in center for accurate scan": "துல்லியமான ஸ்கேனிற்கு இலையை மையத்தில் வைக்கவும்",
    "Open Camera": "கேமராவைத் திற",
    "Upload Local": "பதிவேற்றுக",
    "AI Neural Analysis...": "AI நரம்பியல் பகுப்பாய்வு...",
    "High Severity": "அதிக தீவிரம்",
    "Confidence Score:": "நம்பிக்கை மதிப்பெண்:",
    "Infection Rate": "தொற்று விகிதம்",
    "Status": "நிலைமை",
    "Immediate Advice": "உடனடி அறிவுரை",
    "AgroAI Diagnostic Chat": "அக்ரோAI நோய் கண்டறிதல் அரட்டை",
    "Instant agronomy advice": "உடனடி விவசாய ஆலோசனை",
    "Ask AI": "AI-யிடம் கேள்",
    "How it works": "இது எப்படி வேலை செய்கிறது",
    "Our neural network analyzes leaf patterns, discoloration, and texture to identify 40+ common crop diseases with up to 99% accuracy.": "எங்கள் நரம்பியல் நெட்வொர்க் இலை வடிவங்கள், நிறமாற்றம் மற்றும் அமைப்பை பகுப்பாய்வு செய்து 40-க்கும் மேற்பட்ட பொதுவான பயிர் நோய்களை 99% துல்லியத்துடன் கண்டறிகிறது.",

    // Local Farmers Page
    "Local Farmers": "உள்ளூர் விவசாயிகள்",
    "Connect directly with producers in your area.": "உங்கள் பகுதியில் உள்ள தயாரிப்பாளர்களுடன் நேரடியாக இணையுங்கள்.",
    "Search farmers by name or area...": "விவசாயிகளை பெயர் அல்லது பகுதி மூலம் தேடவும்...",
    "No farmers found.": "விவசாயிகள் யாரும் கண்டறியப்படவில்லை.",
    "Farm Size:": "பண்ணை அளவு:",
    "Back to Farmers": "விவசாயிகள் பக்கத்திற்குச் செல்",
    "Available Produce": "கிடைக்கும் பயிர்கள்",
    "No produce listed by this farmer yet.": "இந்த விவசாயி இன்னும் எந்தப் பயிரையும் பட்டியலிடவில்லை.",
    "kg available": "கிலோ கிடைக்கிறது",

    // My Produce (Products)
    "My Produce": "எனது உற்பத்தி",
    "Manage listings & purchase requests": "பட்டியல்கள் மற்றும் கொள்முதல் கோரிக்கைகளை நிர்வகிக்கவும்",
    "No produces listed yet": "தயாரிப்புகள் எதுவும் இன்னும் பட்டியலிடப்படவில்லை",
    "Start listing your freshly harvested crops to get orders from customers!": "வாடிக்கையாளர்களிடமிருந்து ஆர்டர்களைப் பெற உங்கள் புதிய அறுவடைப் பயிர்களைப் பட்டியலிடத் தொடங்குங்கள்!",
    "List First Produce": "முதல் உற்பத்தியைப் பட்டியலிடுக",
    "Fresh produce straight from our local farm fields.": "எங்கள் உள்ளூர் பண்ணை வயல்களில் இருந்து நேரடியாக புதிய தயாரிப்புகள்.",
    "kg in stock": "கிலோ இருப்பில் உள்ளது",
    "Requests Pending": "கோரிக்கைகள் நிலுவையில் உள்ளன",
    "Listing Active": "பட்டியல் செயலில் உள்ளது",
    "Pending Customer Orders": "நிலுவையில் உள்ள வாடிக்கையாளர் ஆர்டர்கள்",
    "No phone": "தொலைபேசி எண் இல்லை",
    "kg ordered": "கிலோ ஆர்டர் செய்யப்பட்டது",
    "List Produce": "உற்பத்தியைப் பட்டியலிடுக",
    "Post to customer shop": "வாடிக்கையாளர் கடைக்கு அனுப்பவும்",
    "Describe harvest date, variety, crop quality...": "அறுவடை தேதி, வகை, பயிர் தரம் விவரிக்கவும்...",
    "Price ($ / kg)": "விலை ($ / கிலோ)",
    "Stock (kg)": "இருப்பு (கிலோ)",
    "List Produce Listing": "உற்பத்திப் பட்டியலைச் சேர்க்கவும்",

    // AgroAI Assistant
    "Your expert digital partner for precision farming and crop health.": "துல்லியமான விவசாயம் மற்றும் பயிர் ஆரோக்கியத்திற்கான உங்கள் நிபுணத்துவ டிஜிட்டல் கூட்டாளி.",
    "Issue Identified": "பிரச்சனை கண்டறியப்பட்டது",
    "How are my wheat crops doing today? Any alerts I should know about?": "இன்று என் கோதுமை பயிர்கள் எப்படி இருக்கின்றன? நான் தெரிந்து கொள்ள வேண்டிய எச்சரிக்கைகள் ஏதேனும் உள்ளதா?",
    "From your scan yesterday in Sector B-12, I've identified signs of Wheat Leaf Rust. The orange-brown pustules are spreading due to high humidity.": "செக்டார் B-12-ல் நேற்று நீங்கள் செய்த ஸ்கேனிலிருந்து, கோதுமை இலை துரு நோயின் அறிகுறிகளை நான் கண்டறிந்துள்ளேன். அதிக ஈரப்பதம் காரணமாக ஆரஞ்சு-பழுப்பு புடைப்புகள் பரவி வருகின்றன.",
    "Action recommended within 48 hours to prevent 15% yield loss.": "15% மகசூல் இழப்பைத் தடுக்க 48 மணி நேரத்திற்குள் நடவடிக்கை எடுக்க பரிந்துரைக்கப்படுகிறது.",
    "I recommend applying a triazole-based fungicide. Would you like me to check local inventory for specific products?": "டிரையாசோல் அடிப்படையிலான பூஞ்சைக் கொல்லியைப் பயன்படுத்த பரிந்துரைக்கிறேன். குறிப்பிட்ட தயாரிப்புகளுக்கு உள்ளூர் இருப்பை நான் சரிபார்க்க வேண்டுமா?",
    "Which pesticide?": "எந்த பூச்சிக்கொல்லி?",
    "Organic alternatives?": "இயற்கை மாற்றுகள்?",
    "Prevent future rust": "வருங்கால துரு நோயைத் தடுத்தல்",
    "Ask AgroAI...": "அக்ரோAI-யிடம் கேள்...",

    // Dashboard Page
    "Good morning, Alex": "காலை வணக்கம், அலெக்ஸ்",
    "Your farm is looking healthy today. 3 alerts need your attention.": "உங்கள் பண்ணை இன்று ஆரோக்கியமாக இருக்கிறது. 3 எச்சரிக்கைகள் உங்கள் கவனத்திற்குத் தேவை.",
    "WEATHER STATUS": "வானிலை நிலவரம்",
    "Partly cloudy • High humidity (74%)": "ஓரளவு மேகமூட்டம் • அதிக ஈரப்பதம் (74%)",
    "Pest Warning": "பூச்சி எச்சரிக்கை",
    "Fall Armyworm activity detected nearby.": "அருகில் படைப்புழு நடமாட்டம் கண்டறியப்பட்டது.",
    "High Risk": "அதிக ஆபத்து",
    "Scan Crop for AI Detection": "AI கண்டறிதலுக்குப் பயிரை ஸ்கேன் செய்",
    "Manage Farm Inventory": "பண்ணை இருப்பை நிர்வகி",
    "Market Summary": "சந்தை சுருக்கம்",
    "Potatoes (Grade A)": "உருளைக்கிழங்கு (தரம் A)",
    "Cherry Tomatoes": "செர்ரி தக்காளி",
    "Trending Up": "அதிகரித்து வருகிறது",
    "Stable": "நிலையானது",

    // BuyQuantityModal
    "Place Request": "கோரிக்கையைச் சமர்ப்பி",
    "Select order volume": "ஆர்டர் அளவைத் தேர்ந்தெடுக்கவும்",
    "Product": "தயாரிப்பு",
    "Stock: {product.stock} units": "இருப்பு: {product.stock} அலகுகள்",
    "Order Quantity": "ஆர்டர் அளவு",
    "Units": "அலகுகள்",
    "Confirm Purchase": "கொள்முதலை உறுதிசெய்",
    "Maximum available stock is {product.stock} units.": "அதிகபட்சமாக கிடைக்கும் இருப்பு {product.stock} அலகுகள்.",
    "Cannot buy more than available stock ({product.stock}).": "கிடைக்கும் இருப்பை விட அதிகமாக வாங்க முடியாது ({product.stock}).",
    "Ordering full store stock listing.": "முழு கடை இருப்பு பட்டியலையும் ஆர்டர் செய்கிறீர்கள்.",
    "unit": "அலகு",
    "units": "அலகுகள்",
    "The Future of Agriculture": "விவசாயத்தின் எதிர்காலம்",
    "Insights, markets & tools": "நுண்ணறிவுகள், சந்தைகள் மற்றும் கருவிகள்",
    "Shop Fresh": "புதிய பொருட்களை வாங்குங்கள்",
    "Direct from local farms": "உள்ளூர் பண்ணைகளிலிருந்து நேரடியாக",
    "Seller Hub": "விற்பனையாளர் மையம்",
    "Manage stock & orders": "இருப்பு மற்றும் ஆர்டர்களை நிர்வகியுங்கள்",
    "Quick Start": "விரைவு தொடக்கம்"
  }
};

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Language state
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    if (language === 'ta' && translations.ta[key]) {
      return translations.ta[key];
    }
    return key;
  };

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const { user, profile, role } = JSON.parse(stored);
      setUser(user);
      setProfile(profile);
      setRole(role);
    }
    setLoading(false);
  }, []);

  // Persist session changes
  const persist = (data) => {
    localStorage.setItem('auth', JSON.stringify(data));
  };

  // Helper: login
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { user, profile, role } = res.data;
    setUser(user);
    setProfile(profile);
    setRole(role);
    persist({ user, profile, role });
    return res.data;
  };

  // Helper: register (includes role and profile data)
  const register = async (data) => {
    const res = await axios.post('/api/auth/register', data);
    const { user, profile, role } = res.data;
    setUser(user);
    setProfile(profile);
    setRole(role);
    persist({ user, profile, role });
    return res.data;
  };

  // Helper: switch role
  const switchRole = async (userId, targetRole) => {
    const res = await axios.post('/api/auth/switch-role', { userId, targetRole });
    const { profileExists, profile, targetRole: newRole } = res.data;
    if (profileExists) {
      setProfile(profile);
      setRole(newRole);
      persist({ user, profile, role: newRole });
    }
    return res.data;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setProfile(null);
    setRole(null);
    localStorage.removeItem('auth');
  };

  return (
    <RoleContext.Provider
      value={{ 
        user, profile, role, loading, 
        setUser, setProfile, setRole, 
        login, register, switchRole, logout,
        language, setLanguage, t 
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
