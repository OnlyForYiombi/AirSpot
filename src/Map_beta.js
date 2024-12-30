import React, { useEffect } from "react";
import dummy from "./dummy";
import "./Map.css";

function MyMap_beta() {
  useEffect(() => {
    const initMap = async () => {
      while (!window.google || !window.google.maps || !window.google.maps.visualization) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const adjustRadiusByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 7;
        if (zoomLevel <= 6) return 10;
        if (zoomLevel <= 7) return 15;
        if (zoomLevel <= 8) return 20;
        if (zoomLevel <= 9) return 25;
        if (zoomLevel <= 10) return 30;
        if (zoomLevel <= 11) return 35;
        if (zoomLevel <= 12) return 40;
        if (zoomLevel <= 13) return 45;
        if (zoomLevel <= 14) return 50;
        if (zoomLevel <= 15) return 55;
        if (zoomLevel <= 16) return 60;
        return 65;
      };

      const adjustMaxIntensityByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 10000;
        if (zoomLevel <= 6) return 8000;
        if (zoomLevel <= 7) return 7000;
        if (zoomLevel <= 8) return 6000;
        if (zoomLevel <= 9) return 4000;
        if (zoomLevel <= 10) return 2000;
        if (zoomLevel <= 11) return 900;
        if (zoomLevel <= 12) return 500;
        if (zoomLevel <= 13) return 300;
        if (zoomLevel <= 14) return 200;
        if (zoomLevel <= 15) return 100;
        return 50;
      };

      const clusterData = (data, zoom) => {
        const clusterSizes = {
          5: 2.0,
          6: 1.8,
          7: 1.5,
          8: 1.2,
          9: 1.1,
          10: 1.08,
          11: 1.05,
          12: 1.02,
          13: 1.01,
        };
      
        const clusterSize = clusterSizes[zoom] || 0.5; // 적절한 기본 클러스터 크기 설정
        const clusters = {};
      
        data.forEach(({ location, weight }) => {
          const latCluster = Math.floor(location.lat() / clusterSize) * clusterSize;
          const lngCluster = Math.floor(location.lng() / clusterSize) * clusterSize;
          const key = `${latCluster},${lngCluster}`;
      
          if (!clusters[key]) {
            clusters[key] = { count: 0, totalWeight: 0, goodCount: 0, badCount: 0 };
          }
      
          clusters[key].count += 1;
          clusters[key].totalWeight += weight;
      
          if (weight <= 30) {
            clusters[key].goodCount += 1;
          } else {
            clusters[key].badCount += 1;
          }
        });
      
        return Object.entries(clusters).map(([key, value]) => {
          const [lat, lng] = key.split(",").map(Number);
      
          // 클러스터 내 데이터 비율 계산
          const goodRatio = value.goodCount / value.count;
          const badRatio = value.badCount / value.count;
      
          // 가중치 정규화 및 제한
          const normalizedWeight = Math.min(value.totalWeight / value.count, 100);
      
          // 가중치 결정
          let weight;
          if (badRatio >= 0.7) {
            weight = 80;
          } else if (goodRatio >= 0.7) {
            weight = 10;
          } else {
            weight = normalizedWeight; // 정규화된 가중치 사용
          }
      
          return {
            location: new window.google.maps.LatLng(lat, lng),
            weight,
          };
        });
      };
      

      const rawData = dummy();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const map = new window.google.maps.Map(document.getElementById("map"), {
              center: userLocation,
              zoom: 14,
              mapId: "690be8e18b786646",
              minZoom: 5,
              maxZoom: 17,
            });

            let heatmapLayer;

            const updateHeatmap = () => {
              const zoom = map.getZoom();
              const heatmapData = clusterData(rawData, zoom);
            
              if (heatmapLayer) {
                heatmapLayer.setMap(null);
              }
            
              heatmapLayer = new window.google.maps.visualization.HeatmapLayer({
                data: heatmapData.map((d) => ({
                  location: d.location,
                  weight: d.weight,
                })),
                map,
                radius: adjustRadiusByZoom(zoom),
                opacity: 0.6,
                maxIntensity: adjustMaxIntensityByZoom(zoom), // 줌 수준에 따른 정규화된 최대값
                gradient: [
                  "rgba(0, 255, 255, 0)",
                  "rgba(0, 0, 255, 0.4)",
                  "rgba(0, 255, 0, 0.7)",
                  "rgba(255, 255, 0, 0.8)",
                  "rgba(255, 165, 0, 0.9)",
                  "rgba(255, 0, 0, 1.0)",
                ],
              });
            };
            
            updateHeatmap();

            map.addListener("zoom_changed", updateHeatmap);

            new window.google.maps.Marker({
              position: userLocation,
              map,
              title: "Your Location",
            });
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
            alert("위치 정보를 가져오지 못했습니다.");
          }
        );
      }
    };

    initMap();
  }, []);

  return (
    <div className="map-container">
      <h1 className="map-title">AIRSPOT.GLOBAL</h1>
      <hr className="hr_line" />
      <div className="map-box">
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
  );
}

export default MyMap_beta;

