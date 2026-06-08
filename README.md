# Material Tracker

A responsive web application for tracking income, expenses, and handovers with real-time analytics and data export capabilities.

## Features

- 📊 **Dashboard** - Real-time visualization with income vs outgoing charts
- 💰 **Income Tracking** - Record and manage income entries
- 📉 **Expense Tracking** - Track all outgoing expenses
- 🤝 **Handover Management** - Monitor and track handover transactions
- 📈 **Analytics** - Interactive charts with Chart.js (horizontal bar & doughnut charts)
- 💾 **Data Persistence** - LocalStorage-based data management
- 📥 **Export** - Export data to Excel, CSV with SheetJS
- 🌓 **Dark/Light Theme** - Toggle between themes with localStorage persistence
- 📱 **Responsive Design** - Mobile-first approach for all devices
- ⚡ **Smooth Transitions** - CSS animations for better UX

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, responsive design
- **JavaScript (ES6)** - Dynamic functionality
- **Bootstrap 5** - Responsive framework
- **Chart.js** - Data visualization
- **SheetJS** - Excel export functionality
- **LocalStorage API** - Client-side data persistence

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Start tracking your income, expenses, and handovers

## Usage

### Dashboard
- View real-time totals: Income, Outgoing, Balance, and Pending Handovers
- Analyze trends with interactive charts

### Income Section
- Add new income records with date and description
- Edit or delete existing records
- View all income history in table format

### Outgoing Section
- Record expenses with amount and description
- Manage expense records (edit/delete)
- Track spending patterns

### Handover Section
- Create handover transactions with recipient details
- Track status (Pending/Completed)
- Add notes for context

### Export Section
- **Excel Export** - Multi-sheet workbook with Income, Outgoing, Handover, and Summary sheets
- **CSV Export** - Comma-separated values for compatibility
- **PDF Export** - Coming soon

### Theme Toggle
- Click the moon/sun icon in the navbar to toggle between dark and light themes
- Your preference is automatically saved

## Data Management

All data is stored in your browser's LocalStorage. Your data is:
- ✅ Saved locally on your device
- ✅ Never sent to external servers
- ✅ Persisted across browser sessions
- ⚠️ Cleared if browser data is deleted

## Keyboard Shortcuts

- **Theme Toggle**: Click the moon/sun icon in the navbar
- **Navigation**: Use the navbar links to jump between sections

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Installation

No installation required! Simply open `index.html` in any modern web browser.

### For Local Development

If you'd like to run this locally with a development server:

```bash
# Using Python (built-in on most systems)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Then visit: http://localhost:8000
```

## File Structure

```
material_tracker/
├── index.html       # Main HTML file
├── style.css        # Responsive styles with theme support
├── script.js        # JavaScript functionality
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## Performance

- No external API calls
- Lightweight dependencies (CDN-hosted)
- Optimized for fast load times
- LocalStorage for instant data access

## Privacy & Security

- All data stored locally in your browser
- No authentication required
- No server-side processing
- No tracking or analytics

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Respects user's reduced-motion preferences
- Mobile-friendly touch targets

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Troubleshooting

### Data not saving?
- Check if LocalStorage is enabled in your browser
- Try clearing browser cache and reloading

### Charts not displaying?
- Ensure you have internet connection (Chart.js is from CDN)
- Check browser console for errors

### Export not working?
- Verify SheetJS library is loaded (check browser console)
- Ensure you have added some records before exporting

## Future Enhancements

- [ ] Category-based tracking
- [ ] Budget planning features
- [ ] Data backup to cloud
- [ ] Multi-user support
- [ ] Mobile app version
- [ ] Advanced reporting

## Support

For issues or feature requests, please create an issue in the GitHub repository.

---

**Made with ❤️ for efficient material tracking**
