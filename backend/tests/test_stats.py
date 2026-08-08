def test_stats_returns_expected_shape(client):
    res = client.get('/api/stats')
    assert res.status_code == 200
    stats = res.get_json()['stats']
    for key in ('total_donors', 'active_donors', 'active_requests', 'fulfilled_requests', 'total_cities'):
        assert key in stats


def test_health_endpoint(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    assert res.get_json()['status'] == 'ok'
