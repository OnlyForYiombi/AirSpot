import React, { useEffect } from "react";
import dummy from "./dummy";
import "./Map.css";

function MyMap() {
  useEffect(() => {
    const initMap = async () => {
      while (!window.google || !window.google.maps || !window.google.maps.visualization) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 줌 레벨별 반경 조정
      const adjustRadiusByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 7;
        if (zoomLevel <= 6) return 7;
        if (zoomLevel <= 7) return 15;
        if (zoomLevel <= 8) return 20;
        if (zoomLevel <= 9) return 25;
        if (zoomLevel <= 10) return 20;
        if (zoomLevel <= 11) return 20;
        if (zoomLevel <= 12) return 20;
        if (zoomLevel <= 13) return 20;
        if (zoomLevel <= 14) return 20;
        if (zoomLevel <= 15) return 25;
        if (zoomLevel <= 16) return 28;
        return 30;
      };

      // 줌 레벨별 maxIntensity 조정
      const adjustMaxIntensityByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 10000; // 줌 레벨 5 이하: 최대 밀도
        if (zoomLevel <= 6) return 8000; // 줌 레벨 5 이하: 최대 밀도
        if (zoomLevel <= 7) return 7000; // 줌 레벨 5 이하: 최대 밀도
        if (zoomLevel <= 8) return 6000;  // 줌 레벨 6
        if (zoomLevel <= 9) return 4000;  // 줌 레벨 7
        if (zoomLevel <= 10) return 2000;  // 줌 레벨 8
        if (zoomLevel <= 11) return 900;  // 줌 레벨 9
        if (zoomLevel <= 12) return 500; // 줌 레벨 10
        if (zoomLevel <= 13) return 300; // 줌 레벨 11
        if (zoomLevel <= 14) return 200;  // 줌 레벨 12
        if (zoomLevel <= 15) return 100;  // 줌 레벨 13
        return 50;                      // 줌 레벨 14 이상: 세부 표현
      };
      

      // 줌 레벨별 클러스터 크기 및 데이터 계산
      const clusterData = (data, zoom) => {
        const clusterSizes = {
          5: 2.0, // 줌 레벨 5: 대규모 클러스터
          6: 1.8,
          7: 1.5,
          8: 1.5,
          9: 1.1, // 줌 레벨 9: 중간 클러스터
          10: 1.08,
          11: 1.05,
          12: 1.02, // 줌 레벨 12~13: 세부 클러스터
          13: 1.01,
        };

        const clusterSize = clusterSizes[zoom] || 0.1; // 기본값

        const clusters = {};

        // 클러스터링 데이터 생성
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
            clusters[key].goodCount += 1; // 좋음
          } else {
            clusters[key].badCount += 1; // 나쁨
          }
        });

        // 줌 레벨별 데이터 비율 계산 및 클러스터 결과 생성
        return Object.entries(clusters).map(([key, value]) => {
          const [lat, lng] = key.split(",").map(Number);
          const goodRatio = value.goodCount / value.count;
          const badRatio = value.badCount / value.count;

          let weight;
          if (badRatio >= 0.7) {
            weight = 80; // 빨간색 (나쁨 비율 높음)
          } else if (goodRatio >= 0.7) {
            weight = 10; // 파란색 (좋음 비율 높음)
          } else {
            weight = 50; // 중간 상태
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
              const heatmapData =
                zoom >= 5
                  ? rawData.map((d) => ({
                      location: d.location,
                      weight: d.weight,
                    }))
                  : clusterData(rawData, zoom);

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
                maxIntensity: adjustMaxIntensityByZoom(zoom), // 줌 레벨에 따른 maxIntensity 동적 설정
                gradient: [
                  "rgba(0, 255, 255, 0)", // 투명 파란색
                    "rgba(0, 0, 255, 0.4)", // 파란색 (좋음)
                    "rgba(0, 255, 0, 0.7)", // 초록색
                    "rgba(255, 255, 0, 0.8)", // 노란색
                    "rgba(255, 165, 0, 0.9)", // 주황색
                    "rgba(255, 0, 0, 1.0)", // 빨간색 (매우 나쁨)
                  
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

export default MyMap;
