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


def test_list_donors_hides_phone_when_anonymous(client):
    body = client.get('/api/donors').get_json()
    assert body['donors']
    assert all('phone' not in d for d in body['donors'])


def test_list_donors_shows_phone_when_authenticated(client, donor_auth):
    body = client.get('/api/donors', headers=donor_auth['headers']).get_json()
    assert any(d.get('phone') for d in body['donors'])


def test_get_donor_detail_hides_phone_when_anonymous(client):
    listed = client.get('/api/donors').get_json()['donors'][0]
    res = client.get(f"/api/donors/{listed['id']}")
    assert 'phone' not in res.get_json()['donor']


def test_get_donor_detail_shows_phone_when_authenticated(client, donor_auth):
    listed = client.get('/api/donors').get_json()['donors'][0]
    res = client.get(f"/api/donors/{listed['id']}", headers=donor_auth['headers'])
    assert res.get_json()['donor'].get('phone')
