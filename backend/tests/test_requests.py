def _make_request_payload(**overrides):
    payload = {
        'patient_name': 'Test Xəstə',
        'blood_type': 'A+',
        'hospital': 'Test Xəstəxana',
        'city': 'Bakı',
        'contact_phone': '+994500000000',
        'urgency': 'Urgent',
    }
    payload.update(overrides)
    return payload


def test_create_request_requires_token(client):
    res = client.post('/api/requests', json=_make_request_payload())
    assert res.status_code == 401


def test_create_request_success(client, donor_auth):
    res = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload())
    assert res.status_code == 201
    assert res.get_json()['request']['patient_name'] == 'Test Xəstə'


def test_create_request_missing_fields_fails(client, donor_auth):
    res = client.post('/api/requests', headers=donor_auth['headers'], json={'patient_name': 'X'})
    assert res.status_code == 400


def test_create_request_rejects_invalid_phone(client, donor_auth):
    res = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload(contact_phone='12345'))
    assert res.status_code == 400


def test_update_request_rejects_invalid_phone(client, donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload()).get_json()['request']
    res = client.put(f"/api/requests/{created['id']}", headers=donor_auth['headers'], json={'contact_phone': '12345'})
    assert res.status_code == 400


def test_list_requests_defaults_to_active(client):
    res = client.get('/api/requests')
    assert res.status_code == 200
    body = res.get_json()
    assert all(r['status'] == 'active' for r in body['requests'])


def test_update_request_owner_can_edit(client, donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload()).get_json()['request']
    res = client.put(f"/api/requests/{created['id']}", headers=donor_auth['headers'], json={'status': 'fulfilled'})
    assert res.status_code == 200
    assert res.get_json()['request']['status'] == 'fulfilled'


def test_update_request_non_owner_forbidden(client, donor_auth, second_donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload()).get_json()['request']
    res = client.put(f"/api/requests/{created['id']}", headers=second_donor_auth['headers'], json={'status': 'fulfilled'})
    assert res.status_code == 403


def test_delete_request_non_owner_forbidden(client, donor_auth, second_donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload()).get_json()['request']
    res = client.delete(f"/api/requests/{created['id']}", headers=second_donor_auth['headers'])
    assert res.status_code == 403


def test_delete_request_owner_succeeds(client, donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload()).get_json()['request']
    res = client.delete(f"/api/requests/{created['id']}", headers=donor_auth['headers'])
    assert res.status_code == 200
    assert client.get(f"/api/requests/{created['id']}").status_code == 404


def test_list_requests_hides_phone_when_anonymous(client, donor_auth):
    client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload())
    body = client.get('/api/requests').get_json()
    assert body['requests']
    assert all('contact_phone' not in r for r in body['requests'])


def test_list_requests_shows_phone_when_authenticated(client, donor_auth):
    client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload())
    body = client.get('/api/requests', headers=donor_auth['headers']).get_json()
    assert any(r.get('contact_phone') for r in body['requests'])


def test_get_request_detail_hides_phone_when_anonymous(client, donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json=_make_request_payload()).get_json()['request']
    res = client.get(f"/api/requests/{created['id']}")
    assert 'contact_phone' not in res.get_json()['request']
