# VPS Resource Calculator

A comprehensive web-based calculator for simulating resource consumption of applications deployed on a VPS (Virtual Private Server).

![screenshot](https://github.com/santiagopaniaguam/vps-resources-calculator/blob/main/UI%20Picture%20VPS%20Resource%20Calc.PNG)

## Features

### Input Parameters

- **Number of Concurrent Users**: Select from preset values (10 to 5,000) or enter custom values
- **Application Type**: Choose between Light, Medium, Heavy, or Very Heavy workloads
- **RAM per User**: Configurable memory consumption per concurrent user (5 MB to 100 MB)
- **CPU Cores**: Available CPU cores (1 to 16 cores)
- **Total RAM**: Server RAM capacity (1 GB to 64 GB)
- **Total Storage**: Available disk space (20 GB to 1 TB)
- **Storage per User**: User data storage requirements (1 MB to 500 MB)
- **Base Storage**: Operating system and application baseline storage
- **CPU Intensity**: Request processing intensity (Low to Very High)
- **Base RAM**: System and application baseline memory usage

### Calculations

The calculator provides real-time simulation of:

1. **RAM Usage**
   - Calculates total RAM consumption: Base RAM + (Users × RAM per User)
   - Shows used vs. available memory
   - Displays percentage utilization with color-coded progress bars

2. **CPU Usage**
   - Estimates CPU load based on concurrent users and request intensity
   - Factors in number of cores for parallel processing
   - Shows percentage load per core

3. **Storage Usage**
   - Calculates total storage: Base Storage + (Users × Storage per User)
   - Tracks used vs. available disk space
   - Monitors capacity utilization

### Visual Indicators

- **Progress Bars**: Color-coded from green (optimal) to red (critical)
  - Green: 0-50% (Optimal)
  - Teal: 50-70% (Good)
  - Orange: 70-85% (Warning)
  - Red: 85-100% (Critical)
  - Dark Red: >100% (Overload)

- **Status Messages**: Real-time feedback on resource health
  - ✓ Optimal: System running smoothly
  - ⚠ Warning: Close monitoring recommended
  - ✗ Critical: Near or exceeding capacity

### Recommendations

The calculator provides intelligent recommendations based on your configuration:

- Suggests hardware upgrades when resources are constrained
- Recommends optimization strategies (caching, load balancing)
- Identifies when horizontal scaling is needed
- Provides alerts for critical resource shortages
- Offers baseline configuration validation for optimal setups

### Overall System Status

A comprehensive system health indicator:
- 🟢 HEALTHY: System performing well (<70% utilization)
- 🟡 WARNING: Close monitoring recommended (70-85%)
- 🟠 CRITICAL: System at risk (85-100%)
- 🔴 OVERLOAD: Immediate action required (>100%)

## Usage

1. Open `index.html` in a web browser
2. Configure your VPS parameters using the dropdown menus
3. Click "Calculate Resources" or press Enter in custom input fields
4. Review the resource usage results and recommendations
5. Adjust parameters to optimize your configuration

## Technical Details

### CPU Calculation Model

The CPU usage is calculated using the formula:
```
baseLoad = (users × cpuMultiplier) / cores
cpuPercentage = (baseLoad / 30) × 100
```

Where cpuMultiplier varies by intensity:
- Low: 0.3 (static content)
- Medium: 0.6 (dynamic pages)
- High: 0.85 (API processing)
- Very High: 1.2 (computation intensive)

### Memory Model

Total RAM = Base RAM + (Number of Users × RAM per User)

Typical RAM per user by application type:
- Light: 5-10 MB (static sites, simple APIs)
- Medium: 25 MB (standard web applications)
- Heavy: 50 MB (data processing applications)
- Very Heavy: 100 MB (real-time, ML applications)

### Storage Model

Total Storage = Base Storage + (Number of Users × Storage per User)

Base storage typically includes:
- Operating system: 2-5 GB
- Application code: 0.5-2 GB
- Dependencies and libraries: 1-5 GB
- System files and logs: 1-3 GB

## Files

- `index.html`: Main application structure
- `styles.css`: Visual styling and responsive design
- `script.js`: Calculation logic and interactivity
- `README.md`: Documentation

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

Free to use and modify for any purpose.
