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


def test_create_request_requires_auth(client):
    res = client.post('/api/requests', json=_make_request_payload())
    assert res.status_code == 401


def test_create_request_success(donor_auth):
    res = donor_auth['client'].post('/api/requests', json=_make_request_payload())
    assert res.status_code == 201
    assert res.get_json()['request']['patient_name'] == 'Test Xəstə'


def test_create_request_missing_fields_fails(donor_auth):
    res = donor_auth['client'].post('/api/requests', json={'patient_name': 'X'})
    assert res.status_code == 422


def test_create_request_rejects_invalid_phone(donor_auth):
    res = donor_auth['client'].post('/api/requests', json=_make_request_payload(contact_phone='12345'))
    assert res.status_code == 422


def test_update_request_rejects_invalid_phone(donor_auth):
    created = donor_auth['client'].post('/api/requests', json=_make_request_payload()).get_json()['request']
    res = donor_auth['client'].put(f"/api/requests/{created['id']}", json={'contact_phone': '12345'})
    assert res.status_code == 422


def test_list_requests_defaults_to_active(client, donor_auth):
    donor_auth['client'].post('/api/requests', json=_make_request_payload())
    res = client.get('/api/requests')
    assert res.status_code == 200
    body = res.get_json()
    assert all(r['status'] == 'active' for r in body['requests'])


def test_update_request_owner_can_edit(donor_auth):
    created = donor_auth['client'].post('/api/requests', json=_make_request_payload()).get_json()['request']
    res = donor_auth['client'].put(f"/api/requests/{created['id']}", json={'status': 'fulfilled'})
    assert res.status_code == 200
    assert res.get_json()['request']['status'] == 'fulfilled'


def test_update_request_non_owner_forbidden(donor_auth, second_donor_auth):
    created = donor_auth['client'].post('/api/requests', json=_make_request_payload()).get_json()['request']
    res = second_donor_auth['client'].put(f"/api/requests/{created['id']}", json={'status': 'fulfilled'})
    assert res.status_code == 403


def test_update_request_missing_returns_404(donor_auth):
    res = donor_auth['client'].put('/api/requests/999999999', json={'status': 'fulfilled'})
    assert res.status_code == 404


def test_delete_request_non_owner_forbidden(donor_auth, second_donor_auth):
    created = donor_auth['client'].post('/api/requests', json=_make_request_payload()).get_json()['request']
    res = second_donor_auth['client'].delete(f"/api/requests/{created['id']}")
    assert res.status_code == 403


def test_delete_request_owner_succeeds(donor_auth):
    created = donor_auth['client'].post('/api/requests', json=_make_request_payload()).get_json()['request']
    res = donor_auth['client'].delete(f"/api/requests/{created['id']}")
    assert res.status_code == 200
    assert donor_auth['client'].get(f"/api/requests/{created['id']}").status_code == 404


def test_list_requests_hides_phone_when_anonymous(client, donor_auth):
    donor_auth['client'].post('/api/requests', json=_make_request_payload())
    body = client.get('/api/requests').get_json()
    assert body['requests']
    assert all('contact_phone' not in r for r in body['requests'])


def test_list_requests_shows_phone_when_authenticated(donor_auth):
    donor_auth['client'].post('/api/requests', json=_make_request_payload())
    body = donor_auth['client'].get('/api/requests').get_json()
    assert any(r.get('contact_phone') for r in body['requests'])


def test_get_request_detail_hides_phone_when_anonymous(client, donor_auth):
    created = donor_auth['client'].post('/api/requests', json=_make_request_payload()).get_json()['request']
    res = client.get(f"/api/requests/{created['id']}")
    assert 'contact_phone' not in res.get_json()['request']
