import yaml
savefile = "/home/dev/.hiro/projects/rockgardenblossom.yaml"

defaultpose ={"roll":0 , "pitch":0, "yaw":0, "height":80}

with open(savefile, 'r') as infile:
    data = yaml.safe_load(infile)
    state = data['state']
    for point in state['activeGesture']['points']:
        if 'speech' not in point:
            point['speech'] = ''
        point['blossom'] = {"roll":0 , "pitch":0, "yaw":0, "height":80, "speech": point["speech"]}
        approach = point['approach']
        if 'speech' not in approach:
            point['approach']['speech'] = ''
        point['approach']['blossom'] = {"speech": approach["speech"]}
    for gesture in state['gestures']:
        for point in gesture['points']:
            if 'speech' not in point:
                point['speech'] = ''
            point['blossom'] = {"roll":0 , "pitch":0, "yaw":0, "height":80, "speech": point["speech"]}
            approach = point['approach']
            if 'speech' not in approach:
                point['approach']['speech'] = ''
            point['approach']['blossom'] = {"speech": approach["speech"]}

with open(savefile, 'w') as outfile:
    yaml.dump(data, outfile, default_flow_style=False)