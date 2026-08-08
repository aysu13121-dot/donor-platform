def test_respond_to_request_creates_offer(client, donor_auth, second_donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json={
        'patient_name': 'Test Xəstə', 'blood_type': 'A+', 'hospital': 'Test Xəstəxana',
        'city': 'Bakı', 'contact_phone': '+994500000000',
    }).get_json()['request']

    res = client.post(
        f"/api/requests/{created['id']}/respond",
        headers=second_donor_auth['headers'],
        json={'message': 'Kömək edə bilərəm'},
    )
    assert res.status_code == 201
    assert 'offer_id' in res.get_json()


def test_respond_requires_token(client, donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json={
        'patient_name': 'Test Xəstə', 'blood_type': 'A+', 'hospital': 'Test Xəstəxana',
        'city': 'Bakı', 'contact_phone': '+994500000000',
    }).get_json()['request']

    res = client.post(f"/api/requests/{created['id']}/respond", json={})
    assert res.status_code == 401


def test_only_owner_can_view_responses(client, donor_auth, second_donor_auth):
    created = client.post('/api/requests', headers=donor_auth['headers'], json={
        'patient_name': 'Test Xəstə', 'blood_type': 'A+', 'hospital': 'Test Xəstəxana',
        'city': 'Bakı', 'contact_phone': '+994500000000',
    }).get_json()['request']
    client.post(f"/api/requests/{created['id']}/respond", headers=second_donor_auth['headers'], json={})

    forbidden = client.get(f"/api/requests/{created['id']}/responses", headers=second_donor_auth['headers'])
    assert forbidden.status_code == 403

    allowed = client.get(f"/api/requests/{created['id']}/responses", headers=donor_auth['headers'])
    assert allowed.status_code == 200
    assert allowed.get_json()['count'] == 1
