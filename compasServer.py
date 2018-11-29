from flask import Flask, request, json
from flask_restful import Resource, Api, reqparse
import time

# start = time.time()
# print("hello")
# end = time.time()
# print(end - start)

app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('id')
parser.add_argument('location')
parser.add_argument('description', type = str, default = "", location = 'json')

timer = {
	"A" : 0,
	"B" : 0
}

locations  = {
"A" : [0.0 , 0.0],
"B" : [0.0 , 0.0]
}

# latA , lonA, latB, lonB


class loc(Resource):
	def get(self, loc_id):
		print('Call To Retrieve: '+str(loc_id))
		print('Returning Location : '+str(locations[loc_id]))

		timeout = time.time()-timer[loc_id]

		if ( timeout > 5 ):
			return {'loc': [0.0 , 0.0]}

		return {'loc': locations[loc_id]}

	def post(self, loc_id):
		#args = parser.parse_args()
		print('Call To Post: '+str(loc_id))


		timer[loc_id]=time.time()



		# print( '.. ')

		loc = request.form.getlist('location[]')


		locations[loc_id] = [ float(loc[0]) , float(loc[1]) ]

		print('Entry Updated: ')
		print(locations[loc_id])

		# {loc_id: locations[loc_id]}

		return 0

api.add_resource(loc, '/<string:loc_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=80,debug=True)