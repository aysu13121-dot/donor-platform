def test_list_donors_returns_created_donor(client, donor_auth):
    res = client.get('/api/donors')
    assert res.status_code == 200
    body = res.get_json()
    assert body['count'] >= 1
    assert body['pagination']['page'] == 1


def test_list_donors_filters_by_blood_type(client, donor_auth):
    res = client.get(f"/api/donors?blood_type={donor_auth['user']['blood_type']}")
    body = res.get_json()
    assert all(d['blood_type'] == donor_auth['user']['blood_type'] for d in body['donors'])


def test_list_donors_rejects_invalid_pagination(client):
    res = client.get('/api/donors?page=abc')
    assert res.status_code == 422


def test_get_donor_detail_404_for_missing(client):
    res = client.get('/api/donors/999999999')
    assert res.status_code == 404


def test_get_donor_detail_found(client, donor_auth):
    res = client.get(f"/api/donors/{donor_auth['user']['id']}")
    assert res.status_code == 200
    assert res.get_json()['donor']['id'] == donor_auth['user']['id']


def test_list_donors_hides_phone_when_anonymous(client, donor_auth):
    body = client.get('/api/donors').get_json()
    assert body['donors']
    assert all('phone' not in d for d in body['donors'])


def test_list_donors_shows_phone_when_authenticated(donor_auth):
    body = donor_auth['client'].get('/api/donors').get_json()
    assert any(d.get('phone') for d in body['donors'])


def test_get_donor_detail_hides_phone_when_anonymous(client, donor_auth):
    res = client.get(f"/api/donors/{donor_auth['user']['id']}")
    assert 'phone' not in res.get_json()['donor']


def test_get_donor_detail_shows_phone_when_authenticated(donor_auth):
    res = donor_auth['client'].get(f"/api/donors/{donor_auth['user']['id']}")
    assert res.get_json()['donor'].get('phone')
