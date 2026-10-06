jQuery(document).ready(function($) {
    if (typeof citibigTransitData === 'undefined') {
        return;
    }

    // Translation maps for database terms to Persian labels
    var busTypeTranslation = {
        'Private': 'بخش خصوصی',
        'Public': 'بخش عمومی',
        'Auxiliary': 'کمکی',
        'BRT': 'تندرو (BRT)'
    };

    var shiftTypeTranslation = {
        'Day': 'روزانه',
        'Night': 'شبانه'
    };

    // 1. Render Color Chart (Doughnut)
    var colorCtx = document.getElementById('citibigColorChart');
    if (colorCtx && citibigTransitData.colorStats.length > 0) {
        var colorLabels = [];
        var colorCounts = [];
        
        citibigTransitData.colorStats.forEach(function(item) {
            colorLabels.push(item.Color_Type);
            colorCounts.push(item.count);
        });

        new Chart(colorCtx, {
            type: 'doughnut',
            data: {
                labels: colorLabels,
                datasets: [{
                    label: 'تعداد رنگ',
                    data: colorCounts,
                    backgroundColor: [
                        '#3b82f6', '#ef4444', '#10b981', '#f97316', 
                        '#8b5cf6', '#eab308', '#14b8a6', '#b45309', '#64748b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Tahoma', size: 11 }
                        }
                    }
                }
            }
        });
    }

    // 2. Render Route Station Count Chart (Bar)
    var routeCtx = document.getElementById('citibigRouteChart');
    if (routeCtx && citibigTransitData.routeStats.length > 0) {
        var routeNames = [];
        var stationCounts = [];

        citibigTransitData.routeStats.forEach(function(item) {
            routeNames.push(item.Route_Name || 'بدون نام');
            stationCounts.push(item.station_count);
        });

        new Chart(routeCtx, {
            type: 'bar',
            data: {
                labels: routeNames,
                datasets: [{
                    label: 'تعداد ایستگاه‌ها',
                    data: stationCounts,
                    backgroundColor: 'rgba(59, 130, 246, 0.75)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                }
            }
        });
    }

    // 3. Render Bus Types Chart (Pie)
    var busTypeCtx = document.getElementById('citibigBusTypeChart');
    if (busTypeCtx && citibigTransitData.busTypeStats.length > 0) {
        var busTypeLabels = [];
        var busTypeCounts = [];

        citibigTransitData.busTypeStats.forEach(function(item) {
            var label = busTypeTranslation[item.Bus_Type] || item.Bus_Type;
            busTypeLabels.push(label);
            busTypeCounts.push(item.count);
        });

        new Chart(busTypeCtx, {
            type: 'pie',
            data: {
                labels: busTypeLabels,
                datasets: [{
                    data: busTypeCounts,
                    backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Tahoma', size: 11 }
                        }
                    }
                }
            }
        });
    }

    // 4. Render Day vs Night Shift Chart (Horizontal Bar Chart)
    var dayNightCtx = document.getElementById('citibigDayNightChart');
    if (dayNightCtx && citibigTransitData.dayNightStats.length > 0) {
        var shiftLabels = [];
        var shiftCounts = [];

        citibigTransitData.dayNightStats.forEach(function(item) {
            var label = shiftTypeTranslation[item.shift_type] || item.shift_type;
            shiftLabels.push(label);
            shiftCounts.push(item.count);
        });

        new Chart(dayNightCtx, {
            type: 'bar',
            data: {
                labels: shiftLabels,
                datasets: [{
                    label: 'تعداد ایستگاه‌ها',
                    data: shiftCounts,
                    backgroundColor: ['#f59e0b', '#1e293b'],
                    borderColor: ['#d97706', '#0f172a'],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                }
            }
        });
    }

    // 5. Render Station Leaflet Map (Phase 3)
    var mapContainer = document.getElementById('citibigStationMap');
    if (mapContainer && typeof L !== 'undefined' && citibigTransitData.stationCoords.length > 0) {
        var map = L.map('citibigStationMap').setView([35.6892, 51.3890], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        citibigTransitData.stationCoords.forEach(function(station) {
            if (station.Latitude && station.Longitude && station.Latitude !== 0 && station.Longitude !== 0) {
                var busLabel = busTypeTranslation[station.Bus_Type] || station.Bus_Type;
                var shiftLabel = shiftTypeTranslation[station.shift_type] || station.shift_type;

                var popupContent = `
                    <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
                        <h4 style="margin: 0 0 5px 0; color: #1e3a8a;">ایستگاه: ${station.Station_Name}</h4>
                        <p style="margin: 0; font-size: 12px; color: #4b5563;">
                            <b>کد ایستگاه:</b> ${station.code}<br>
                            <b>نوع اتوبوس:</b> ${busLabel}<br>
                            <b>نوبت کاری:</b> ${shiftLabel}
                        </p>
                    </div>
                `;

                L.marker([station.Latitude, station.Longitude])
                    .addTo(map)
                    .bindPopup(popupContent);
            }
        });
    }

    // 6. Live ETA Table Filtering (Phase 4)
    var searchInput = document.getElementById('citibigEtaSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            var filter = this.value.toLowerCase().trim();
            var rows = document.querySelectorAll('#citibigLiveEtaTable tbody tr');
            
            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                if (text.indexOf(filter) > -1) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // 7. Render Peak Hours Line Chart (Phase 5)
    var peakHoursCtx = document.getElementById('citibigPeakHoursChart');
    if (peakHoursCtx && citibigTransitData.peakHoursStats && citibigTransitData.peakHoursStats.length > 0) {
        var hoursLabels = [];
        var recordCounts = [];

        // Initialize all 24 hours to 0 to ensure smooth line chart
        var hoursMap = {};
        for (var i = 0; i < 24; i++) {
            hoursMap[i] = 0;
        }

        citibigTransitData.peakHoursStats.forEach(function(item) {
            hoursMap[item.hour] = item.record_count;
        });

        for (var h = 0; h < 24; h++) {
            hoursLabels.push(String(h).padStart(2, '0') + ':00');
            recordCounts.push(hoursMap[h]);
        }

        new Chart(peakHoursCtx, {
            type: 'line',
            data: {
                labels: hoursLabels,
                datasets: [{
                    label: 'تعداد گزارشات ترافیک',
                    data: recordCounts,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                }
            }
        });
    }

    // 8. Render Top Delayed Stations Chart (Phase 5)
    var delayCtx = document.getElementById('citibigDelayChart');
    if (delayCtx && citibigTransitData.topDelayedStats && citibigTransitData.topDelayedStats.length > 0) {
        var stationNames = [];
        var avgDelays = [];

        citibigTransitData.topDelayedStats.forEach(function(item) {
            stationNames.push(item.Station_Name);
            avgDelays.push(item.avg_delay);
        });

        new Chart(delayCtx, {
            type: 'bar',
            data: {
                labels: stationNames,
                datasets: [{
                    label: 'میانگین زمان انتظار تخمینی (دقیقه)',
                    data: avgDelays,
                    backgroundColor: 'rgba(59, 130, 246, 0.75)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'دقیقه',
                            font: { family: 'Tahoma', size: 11 }
                        }
                    }
                }
            }
        });
    }

    // 9. Render Station Health Chart (Phase 6)
    var stHealthCtx = document.getElementById('citibigStationHealthChart');
    if (stHealthCtx && citibigTransitData.networkHealth && citibigTransitData.networkHealth.stations.length > 0) {
        var stLabels = [], stData = [], stBg = [];
        citibigTransitData.networkHealth.stations.forEach(function(item) {
            stLabels.push(item.Station_Activeness == '1' ? 'فعال (سرویس‌دهی)' : 'غیرفعال (خارج از سرویس)');
            stData.push(item.count);
            stBg.push(item.Station_Activeness == '1' ? '#10b981' : '#ef4444');
        });
        new Chart(stHealthCtx, {
            type: 'doughnut',
            data: { labels: stLabels, datasets: [{ data: stData, backgroundColor: stBg }] },
            options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Tahoma', size: 11 } } } } }
        });
    }

    // 10. Render Route Health Chart (Phase 6)
    var rtHealthCtx = document.getElementById('citibigRouteHealthChart');
    if (rtHealthCtx && citibigTransitData.networkHealth && citibigTransitData.networkHealth.routes.length > 0) {
        var rtLabels = [], rtData = [], rtBg = [];
        citibigTransitData.networkHealth.routes.forEach(function(item) {
            rtLabels.push(item.Route_Activeness == '1' ? 'مسیر فعال' : 'مسیر غیرفعال');
            rtData.push(item.count);
            rtBg.push(item.Route_Activeness == '1' ? '#10b981' : '#ef4444');
        });
        new Chart(rtHealthCtx, {
            type: 'doughnut',
            data: { labels: rtLabels, datasets: [{ data: rtData, backgroundColor: rtBg }] },
            options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Tahoma', size: 11 } } } } }
        });
    }

    // 11. Render Schedule Density Chart (Phase 6)
    var schCtx = document.getElementById('citibigScheduleDensityChart');
    if (schCtx && citibigTransitData.scheduleDensity && citibigTransitData.scheduleDensity.length > 0) {
        var schHours = [], schCounts = [];
        var schMap = {};
        for(var i=0; i<24; i++) schMap[i] = 0;
        citibigTransitData.scheduleDensity.forEach(function(item) { schMap[item.hour] = item.count; });
        for(var h=0; h<24; h++) { schHours.push(String(h).padStart(2, '0') + ':00'); schCounts.push(schMap[h]); }

        new Chart(schCtx, {
            type: 'line',
            data: {
                labels: schHours,
                datasets: [{
                    label: 'تعداد اعزام برنامه‌ریزی شده در ساعت',
                    data: schCounts,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#047857'
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
            }
        });
    }

    // 12. Render Device Mapping Stats (Phase 6)
    var devCtx = document.getElementById('citibigDeviceMappingChart');
    if (devCtx && citibigTransitData.deviceMapping && citibigTransitData.deviceMapping.length > 0) {
        var devStNames = [], devCounts = [];
        citibigTransitData.deviceMapping.forEach(function(item) {
            devStNames.push(item.Station_Name);
            devCounts.push(item.device_count);
        });

        new Chart(devCtx, {
            type: 'bar',
            data: {
                labels: devStNames,
                datasets: [{
                    label: 'تعداد دستگاه‌های متصل (GPS/سنسور)',
                    data: devCounts,
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 1,
                    maxBarThickness: 40
                }]
            },
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, title: { display: true, text: 'تعداد دستگاه', font: { family: 'Tahoma', size: 11 } } },
                    y: { ticks: { font: { family: 'Tahoma', size: 11 } } }
                }
            }
        });
    }
});
