export default async function handler(req, res) {
    try {
        const response = await fetch('https://www.bikeseoul.com/app/station/getStationRealtimeStatus.do');
        const data = await response.json();

        // realtimeList가 포함된 데이터만 반환
        if (data.realtimeList) {
            res.status(200).json(data.realtimeList);
        } else {
            res.status(500).json({ error: 'realtimeList not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bike data' });
    }
}
