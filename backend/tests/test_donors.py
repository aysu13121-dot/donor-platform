def test_list_donors_returns_seed_data(client):
    res = client.get('/api/donors')
    assert res.status_code == 200
    body = res.get_json()
    assert body['count'] >= 1
    assert body['pagination']['page'] == 1


def test_list_donors_filters_by_blood_type(client):
    res = client.get('/api/donors?blood_type=O+')
    body = res.get_json()
    assert all(d['blood_type'] == 'O+' for d in body['donors'])


def test_list_donors_rejects_invalid_pagination(client):
    res = client.get('/api/donors?page=abc')
    assert res.status_code == 400


def test_get_donor_detail_404_for_missing(client):
    res = client.get('/api/donors/999999')
    assert res.status_code == 404


def test_get_donor_detail_found(client):
    listed = client.get('/api/donors').get_json()['donors'][0]
    res = client.get(f"/api/donors/{listed['id']}")
    assert res.status_code == 200
    assert res.get_json()['donor']['id'] == listed['id']
