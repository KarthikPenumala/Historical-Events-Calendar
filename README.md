# Historical Events Calendar

## Overview
A feature-rich interactive calendar application with a dark red glowing theme that displays historical events, festivals, news, and allows users to manage personal events.

## Features

### Core Calendar Features
- Interactive calendar with day, month, and year navigation
- Era selection (Present Era, Ancient History, Prehistoric Era, Geological Time, Cosmic Events)
- Historical events display for selected dates
- Day importance indicator showing the significance of each day

### News Section
- Real-time news updates from various categories
- Automatic news refreshing
- Category filtering (General, India, Business, Technology, Sports, Entertainment, Science, Health)

### Festivals & Events
- Display of festivals and important days for selected dates
- Date selector for viewing festivals on different days
- Day importance header showing the significance of the current date

### Personal Notes/Events
- Add, edit, and delete personal events
- Priority levels (Low, Medium, High)
- Filter by All, Upcoming, or Finished events
- Date and time scheduling

### Visual & Interactive Features
- Dark red glowing theme with animated elements
- Particle background animation
- Sound effects for interactions (with toggle option)
- Loading animation
- Responsive design for different screen sizes

## How to Use

### Opening the Calendar
To avoid path conflicts with ImageMagick or other applications, use the included `OpenCalendar.bat` file to launch the calendar in your default browser.

### Navigation
- Use the month and year navigation buttons to change the displayed month/year
- Click on any day to view events for that date
- Use the era selector to switch between different time periods

### Using the Sidebar
1. **News Tab**
   - Select a category from the dropdown
   - Click the refresh button to update news

2. **Festivals Tab**
   - Use the date selector to view festivals for different dates
   - The day importance header shows the significance of the selected date

3. **Notes Tab**
   - Click "Add Event" to create a new personal event
   - Fill in the details (title, date, time, priority, description)
   - Use the filter buttons to view All, Upcoming, or Finished events
   - Click the check icon to mark an event as completed
   - Click the trash icon to delete an event

### Sound Effects
- Click the sound icon in the top-right corner to toggle sound effects on/off

## Technical Details

### APIs Used
- News API for real-time news updates

### Local Storage
- Personal events are stored in the browser's local storage

### Animations
- CSS animations for UI elements
- Canvas-based particle background
- Loading screen animation

### Sound Effects
- Interactive sound effects for various actions
- All sounds are from free sources (freesound.org)

## Troubleshooting

### Calendar Not Opening Correctly
If clicking on index.html opens a different application (like ImageMagick), use the provided `OpenCalendar.bat` file to launch the calendar correctly.

### No Sound
Check if sounds are enabled by clicking the sound icon in the top-right corner.

### Performance Issues
If animations cause performance issues on older devices, you can modify the particles.js file to reduce the number of particles.

## Hosting Your Calendar

This is a static website that can be hosted on various free platforms:

### Hosting Options

1. **GitHub Pages** (Recommended)
   - Use the included `deploy-to-github.bat` script for easy deployment
   - Follow the step-by-step process in the script

2. **Other Free Hosting Options**
   - Netlify (drag-and-drop deployment)
   - Vercel (connects to GitHub repositories)
   - Cloudflare Pages (fast global CDN)
   - Static.app (simple file upload)

### Detailed Instructions

Detailed hosting instructions are available in:
- `HOSTING.md` - Text instructions for all platforms
- `hosting.html` - Interactive browser-based instructions

Access the hosting guide by clicking "How to Host This Website" on the launcher page.