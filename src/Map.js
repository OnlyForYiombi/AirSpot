//import React, { useEffect } from "react";
import React, { useEffect, useState } from "react";
import dummy from "./dummy";
import "./Map.css";


function MyMap() {
  // Google Maps API 로드 대기
  // useEffect는 컴포넌트가 처음 렌더링된 후 실행되며, initMap 함수는 지도와 히트맵을 초기화합니다.
  const [timeData, setTimeData] = useState("now");
  const [map, setMap] = useState(null);
  const [heatmapLayer, setHeatmapLayer] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      while (!window.google || !window.google.maps || !window.google.maps.visualization) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 줌 레벨별 반경 조정
      // 목적: 줌 레벨이 낮을수록 반경이 작아지며, 지도가 확대될수록 반경이 커집니다.
      const adjustRadiusByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 7;  // 줌 레벨 5 이하: 매우 작은 반경
        if (zoomLevel <= 6) return 10;
        if (zoomLevel <= 7) return 15;
        if (zoomLevel <= 8) return 20;
        if (zoomLevel <= 9) return 25;
        if (zoomLevel <= 10) return 30; // 줌 레벨 10 이상부터 점진적으로 증가
        if (zoomLevel <= 11) return 35;
        if (zoomLevel <= 12) return 40;
        if (zoomLevel <= 13) return 45;
        if (zoomLevel <= 14) return 50;
        if (zoomLevel <= 15) return 55;
        if (zoomLevel <= 16) return 60;
        return 65; // 줌 레벨 16 이상: 가장 큰 반경
      };
      // Recommondation of GPT. TODO: make it own

      // 줌 레벨별 maxIntensity 조정
      // 줌 레벨에 따라 히트맵의 maxIntensity를 동적으로 조정합니다.
      // 목적: 줌 레벨이 낮으면 더 높은 밀도를 허용하고, 확대될수록 낮은 값을 사용합니다.
      const adjustMaxIntensityByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 5000; // 줌 레벨 5 이하: 최대 밀도
        if (zoomLevel <= 6) return 4000; // 줌 레벨 6 이하: 최대 밀도
        if (zoomLevel <= 7) return 3500; // 줌 레벨 7 이하: 최대 밀도
        if (zoomLevel <= 8) return 3000;  // 줌 레벨 8
        if (zoomLevel <= 9) return 2000;  // 줌 레벨 9
        if (zoomLevel <= 10) return 1000;  // 줌 레벨 10
        if (zoomLevel <= 11) return 500;  // 줌 레벨 11
        if (zoomLevel <= 12) return 200; // 줌 레벨 12
        if (zoomLevel <= 13) return 120; // 줌 레벨 13
        if (zoomLevel <= 14) return 100;  // 줌 레벨 14
        if (zoomLevel <= 15) return 70;  // 줌 레벨 15
        return 50;                      // 줌 레벨 16, 17이상: 세부 표현
      };
      //기본 14

      // 줌 레벨별 클러스터 크기 및 데이터 계산
      // 목적: 줌 레벨에 따라 클러스터링 크기를 조정하며, 좋음 및 나쁨 비율을 계산해 색상을 결정합니다.
      // 클러스터링 데이터 생성(clusterData) 함수는 지도상의 데이터 포인트를 클러스터링하여 
      // 줌 레벨에 맞는 데이터 밀집도를 계산하는 역할을 합니다. 
      // 이를 통해 줌 레벨이 낮을 때는 데이터를 합쳐 큰 영역으로 표시하고, 
      // 줌 레벨이 높을 때는 더 세밀한 데이터 표현을 제공합니다.
      //  아래는 이 함수의 동작을 단계적으로 설명한 내용입니다.

      //이 함수는 다음과 같은 주요 단계로 구성됩니다:
      // 클러스터 크기 설정
      // 데이터 클러스터링
      // 클러스터별 통계 생성


      // 의도: : clusterData()
      // 각 줌 레벨에서 사용할 클러스터 크기를 정의합니다.
      // 줌 레벨이 낮으면 클러스터 크기가 크고, 줌 레벨이 높아질수록 클러스터 크기가 작아집니다.
      // 기본값은 0.1로 설정합니다(줌 레벨이 정의되지 않은 경우).
      // 클러스터 크기:
      // 클러스터 크기는 지도를 몇 단위로 나눌지를 결정합니다.
      // 예: 줌 레벨 5에서는 클러스터 크기 2.0으로 데이터를 큰 블록 단위로 묶습니다.

      const clusterData = (data, zoom) => {
        // 1. 클러스터 크기란?
        // 클러스터 크기는 줌 레벨에 따라 데이터를 하나의 그룹으로 묶기 위해 설정된 단위 크기입니다.
        // clusterSize = 2는 지도에서 위도(lat)와 경도(lng)를 2도 단위로 묶는다는 뜻입니다.
        // 예를 들어:
        // 위도가 37.7749이고 경도가 127.4567인 데이터가 있다고 가정합니다.
        // 클러스터 크기 2를 적용하면:
        // 위도는 Math.floor(37.7749 / 2) * 2 = 36.0으로 변환.
        // 경도는 Math.floor(127.4567 / 2) * 2 = 126.0으로 변환.
        // 이 데이터는 (36.0, 126.0)이라는 클러스터로 그룹화됩니다.
        // 즉, 줌 레벨 5에서는 2도 단위로 데이터를 묶는다고 이해할 수 있습니다.
        const clusterSizes = {
          // 한 클러스터가 2도 × 2도 크기의 영역을 대표.
          5: 2.0, // 줌 레벨 5: 대규모 클러스터

          6: 1.8,
          7: 1.5,
          8: 1.5,

          // 한 클러스터가 약 1.1도 × 1.1도 크기의 영역을 대표.
          // 더 세밀한 범위에 속한 데이터 포인트들을 묶음.
          9: 1.1, // 줌 레벨 9: 중간 클러스터
          10: 1.08,
          11: 1.05,
          12: 1.02, // 줌 레벨 12~13: 세부 클러스터
          13: 1.01,
        };
        // === 숫자가 높아지면 클러스터링의 범위가 넓어 지고, 히트맵의 포인트가 적어지고, 넓은 영역이 동일한 값으로 표현됩니다.

        const clusterSize = clusterSizes[zoom] || 0.1; // 기본값

        const clusters = {};

        // 클러스터링 데이터 생성
        // 위도(lat)와 경도(lng)를 clusterSize로 나눠 클러스터 좌표를 계산합니다.
        // Math.floor(location.lat() / clusterSize) * clusterSize는 클러스터의 중심점을 계산합니다.
        // 예를 들어, lat=37.7749, clusterSize=1.5라면, latCluster = 36.0과 같은 형태로 그룹화됩니다.
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

          // "36.0,127.5" → lat=36.0, lng=127.5. : 키 분리 하는 코드
          const [lat, lng] = key.split(",").map(Number);
          const goodRatio = value.goodCount / value.count;
          const badRatio = value.badCount / value.count;

          let weight;
          if (badRatio >= 0.7) {
            weight = 80; // 빨간색 (나쁨 비율 높음)
          } else if (goodRatio >= 0.7) {
            weight = 10; // 파란색 (좋음 비율 높음)
          } else {
            weight = 35; // 중간 상태
          }

          return {
            location: new window.google.maps.LatLng(lat, lng),
            weight,
          };
        });
      };

      //--------
      

      const rawData = dummy();
      // 목적: 줌 레벨 변경에 따라 히트맵 데이터를 새로 고치고 반경, 밀도, 색상을 조정합니다.
      // 히트맵 데이터를 업데이트하고 지도의 줌 레벨에 따라 반영합니다.
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

            const initialData = dummy().filter((d) => d.time === timeData);
            updateHeatmap(initialData);

            googleMap.addListener("zoom_changed", () => {
              const zoomData = dummy().filter((d) => d.time === timeData);
              updateHeatmap(zoomData);
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
  }, [timeData]);

  const handleTimeChange = (time) => {
    setTimeData(time);
  };

  return (
    <div className="map-container">
      <h1 className="map-title">AIRSPOT.GLOBAL</h1>
      <hr className="hr_line" />
      <div className="button-group">
        <button onClick={() => handleTimeChange("now")}>현재</button>
        <button onClick={() => handleTimeChange("1hourAgo")}>1시간 전</button>
        <button onClick={() => handleTimeChange("2hoursAgo")}>2시간 전</button>
        {/* 필요한 시간대 버튼 추가 */}
      </div>
      <div className="map-box">
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
  );
}

export default MyMap;
